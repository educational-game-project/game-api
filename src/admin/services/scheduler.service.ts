import { Log } from "@app/common/model/schema/log.schema";
import { Image } from "@app/common/model/schema/subtype/images.subtype";
import { User } from "@app/common/model/schema/users.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { School } from "@app/common/model/schema/schools.schema";
import { Game } from "@app/common/model/schema/game.schema";
import { TimeHelper } from "@app/common/helpers/time.helper";
import { UserRole } from "@app/common/enums/role.enum";
import { PortfolioVisitor } from "@app/common/model/schema/visitors.schema";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(Log.name) private logsModel: Model<Log>,
    @InjectModel(Image.name) private imagesModel: Model<Image>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(PortfolioVisitor.name) private portfolioVisitorsModel: Model<PortfolioVisitor>,

    private readonly configService: ConfigService,
  ) { }

  private IPREGISTRY_API_KEY = this.configService.get<string>("IPREGISTRY_API_KEY");

  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearDeletedContent() {
    try {
      let sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const endDay = new Date(sevenDaysAgo);
      endDay.setHours(23, 59, 59, 999);

      let users = await this.userModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay }, });
      let schools = await this.schoolModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      let games = await this.gameModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      // let levels = await this.levelModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      // let scores = await this.scoreModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      // let records = await this.recordModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      let images = await this.imagesModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });

      let logs = await this.logsModel.deleteMany({
        $or: [
          { createdAt: { $lt: endDay } },
          { deletedAt: { $ne: null, $lt: endDay } }
        ]
      });

      console.log({
        users: users.deletedCount,
        images: images.deletedCount,
        logs: logs.deletedCount,
        schools: schools.deletedCount,
        games: games.deletedCount,
        // levels: levels.deletedCount,
        // scores: scores.deletedCount,
        // records: records.deletedCount,
      });
    } catch (error) {
      this.logger.error(this.clearDeletedContent.name);
      console.log(error?.message);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateActiveUser() {
    try {
      let users = await this.userModel.find({ isActive: true });

      console.log("Total Active User: ", users?.length);
      if (users?.length) await Promise.all(users.map(async (user) => {
        let logs = await this.logsModel.find({ actor: user?._id }).sort({ createdAt: -1 });
        if (!logs?.length) return await this.userModel.updateOne({ _id: user._id }, { isActive: false });

        let lastLog = logs[0];
        const lastTime = TimeHelper.CalculateTime(lastLog.createdAt, true);

        if (lastTime >= 30) return await this.userModel.updateOne({ _id: user._id }, { isActive: false });
      }));

      users = await this.userModel.find({ isActive: true });

      console.log("New Total Active User: ", users?.length);
    } catch (error) {
      this.logger.error(this.updateActiveUser.name);
      console.log(error?.message);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async recountAdminAndStudent() {
    try {
      let schools = await this.schoolModel.find({ deletedAt: null });

      if (schools?.length) await Promise.all(schools.map(async (school) => {
        let users = await this.userModel.countDocuments({ school: school._id, deletedAt: null, role: UserRole.USER });
        let admins = await this.userModel.countDocuments({ school: school._id, deletedAt: null, role: UserRole.ADMIN });

        await this.schoolModel.updateOne({ _id: school._id }, { $set: { studentsCount: users, adminsCount: admins } });
      }));
    } catch (error) {
      this.logger.error(this.recountAdminAndStudent.name);
      console.log(error?.message);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateVisitorData() {
    try {
      let visitors = await this.portfolioVisitorsModel.find({ isUpdated: { $ne: true } });
      let options = {
        headers: { Authorization: "ApiKey " + this.IPREGISTRY_API_KEY },
      };

      if (visitors?.length) await Promise.all(visitors.map(async (visitor) => {
        const response = await axios.get(
          `https://api.ipregistry.co/${visitor.ipAddress}`,
          options
        );

        if (response?.data) await this.portfolioVisitorsModel.updateOne({ _id: visitor._id }, {
          $set: {
            isUpdated: true,
            ipType: response?.data?.type ?? null,
            city: response?.data?.location?.city ?? null,
            postalCode: response?.data?.location?.postal ?? null,
            region: response?.data?.location?.region?.name ?? null,
            country: response?.data?.location?.country?.name ?? response?.data?.location?.country?.code ?? null,
            continent: response?.data?.location?.continent?.name ?? null,
            loc: response?.data?.location?.latitude ? response?.data?.location?.latitude + ", " + response?.data?.location?.longitude : null,
            timezone: response?.data?.time_zone?.id ?? null,
            timeName: response?.data?.time_zone?.name ? response?.data?.time_zone?.name + " - " + response?.data?.time_zone?.abbreviation : null,
          }
        });
      }));

      console.log("Visitor Updated: ", visitors?.length);
    } catch (error) {
      this.logger.error(this.updateVisitorData.name);
      console.log(error?.message);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async combineDuplicatesVisitorData() {
    try {
      // find duplicated ip address
      let visitors = await this.portfolioVisitorsModel.aggregate([
        { $match: { isUpdated: true } },
        { $group: { _id: "$ipAddress", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ]);
      console.log("Duplicated IP Address: ", visitors);

      if (visitors?.length) {
        await Promise.all(visitors.map(async (visitor) => {
          let duplicatedVisitors = await this.portfolioVisitorsModel.find({ ipAddress: visitor._id }).sort({ createdAt: -1 });

          if (duplicatedVisitors?.length > 1) {
            let count = 0;
            duplicatedVisitors.forEach((duplicatedVisitor) => count += duplicatedVisitor?.count ?? 0);

            let combinedVisitor = {
              count,
              ipAddress: visitor._id,
              ipType: duplicatedVisitors[0]?.ipType ?? null,
              city: duplicatedVisitors[0]?.city ?? null,
              postalCode: duplicatedVisitors[0]?.postalCode ?? null,
              region: duplicatedVisitors[0]?.region ?? null,
              country: duplicatedVisitors[0]?.country ?? null,
              continent: duplicatedVisitors[0]?.continent ?? null,
              loc: duplicatedVisitors[0]?.loc ?? null,
              timezone: duplicatedVisitors[0]?.timezone ?? null,
              time: duplicatedVisitors[0]?.time ?? null,
              timeName: duplicatedVisitors[0]?.timeName ?? null,
              date: duplicatedVisitors[0]?.date ?? null,
              user_agent: duplicatedVisitors[0]?.user_agent ?? null,
              device: duplicatedVisitors[0]?.device ?? null,
              isUpdated: true,
              createdAt: duplicatedVisitors[0]?.createdAt,
              updatedAt: duplicatedVisitors[0]?.updatedAt,
            };

            await this.portfolioVisitorsModel.deleteMany({ ipAddress: visitor._id });
            await this.portfolioVisitorsModel.create(combinedVisitor);
          }
        }));

        // Update visitor number from 1
        let visitors2 = await this.portfolioVisitorsModel.find({}).sort({ createdAt: 1 });
        if (visitors2?.length) await Promise.all(visitors2.map(async (visitor, index) => {
          await this.portfolioVisitorsModel.updateOne({ _id: visitor._id }, { $set: { number: index + 1 } });
        }));
      }
    } catch (error) {
      this.logger.error(this.combineDuplicatesVisitorData.name);
      console.log(error?.message);
    }
  }
}