import { Log } from "@app/common/model/schema/log.schema";
import { Image } from "@app/common/model/schema/subtype/images.subtype";
import { User } from "@app/common/model/schema/users.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { School } from "@app/common/model/schema/schools.schema";
import { Game } from "@app/common/model/schema/game.schema";
import { Level } from "@app/common/model/schema/levels.schema";
import { Score } from "@app/common/model/schema/scores.schema";
import { Record } from "@app/common/model/schema/records.schema";
import { StringHelper } from "@app/common/helpers/string.helpers";

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(Log.name) private logsModel: Model<Log>,
    @InjectModel(Image.name) private imagesModel: Model<Image>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(Record.name) private recordModel: Model<Record>,
  ) { }

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
      let levels = await this.levelModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      let scores = await this.scoreModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
      let records = await this.recordModel.deleteMany({ deletedAt: { $ne: null, $lt: endDay } });
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
        levels: levels.deletedCount,
        scores: scores.deletedCount,
        records: records.deletedCount,
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
        const lastTime = StringHelper.CalculateTime(lastLog.createdAt, true);

        if (lastTime >= 30) return await this.userModel.updateOne({ _id: user._id }, { isActive: false });
      }));

      users = await this.userModel.find({ isActive: true });

      console.log("New Total Active User: ", users?.length);
    } catch (error) {
      this.logger.error(this.updateActiveUser.name);
      console.log(error?.message);
    }
  }
}