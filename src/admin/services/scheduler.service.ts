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
      let sevenDaysLater = new Date();
      sevenDaysLater.setDate(sevenDaysLater.getDate() - 7);
      let startDay = new Date(sevenDaysLater)
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(sevenDaysLater);
      endDay.setHours(23, 59, 59, 999);

      let users = await this.userModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay }, });
      let images = await this.imagesModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay } });
      let schools = await this.schoolModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay } });
      let games = await this.gameModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay } });
      let levels = await this.levelModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay } });
      let scores = await this.scoreModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay } });
      let records = await this.recordModel.deleteMany({ deletedAt: { $ne: null, $gte: startDay, $lte: endDay } });

      let logs = await this.logsModel.deleteMany({
        $or: [
          { createdAt: { $gte: startDay, $lte: endDay } },
          { deletedAt: { $ne: null, $gte: startDay, $lte: endDay } }
        ]
      });

      console.log(users, images, logs, schools, games, levels, scores, records);
    } catch (error) {
      this.logger.error(this.clearDeletedContent.name);
      console.log(error?.message);
    }
  }
}