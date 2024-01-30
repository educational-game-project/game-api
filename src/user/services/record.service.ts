import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { Record, StatusRecord } from "@app/common/model/schema/records.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { CreateReportDto, ReportType } from "@app/common/dto/report.dto";
import { Game } from "@app/common/model/schema/game.schema";
import { Level } from "@app/common/model/schema/levels.schema";
import { LevelsService } from "./levels.service";

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(LevelsService) private readonly levelsService: LevelsService,
  ) { }

  private readonly logger = new Logger(RecordService.name);

  public async record(body: CreateReportDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("user"));

      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.game) });
      if (!game) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("game"))

      let currentLevel = await this.levelsService.getLevel({ id: body.game }, req)
      currentLevel = currentLevel.data

      let current = await this.recordModel.findOne({
        user: user._id,
        game: game._id,
        level: currentLevel.current,
        isValid: true,
      });

      if (!current) {
        body.level = currentLevel.level;
        current = await this.initRecord(body, req);
      }

      switch (body.type) {
        case ReportType.SUCCESS:
          current.status = StatusRecord.PASSED;
          current.isValid = false;

          current.count++;
          current.time.push(body.time);
          current = await current.save();

          // Update Current Level
          await this.levelModel.findOneAndUpdate({ _id: currentLevel?._id }, { $inc: { current: 1 } });

          // Calculate Current Record
          break;

        case ReportType.FAILED:
          if (current.liveLeft === 0) {
            current.isValid = false;
            current.status = StatusRecord.FAILED;
            await this.levelModel.findOneAndUpdate({ _id: currentLevel?._id }, { $set: { isValid: false } });

            current.count++;
            current.time.push(body.time);
            current = await current.save();
          } else {
            current.liveLeft--;
            await this.levelModel.findOneAndUpdate({ _id: currentLevel?._id }, { $inc: { liveLeft: -1 } });

            current.count++;
            current.time.push(body.time);
            current = await current.save();
          }
          break;
      }

      return this.responseService.success(true, StringHelper.successResponse("record", "add"), current);
    } catch (error) {
      this.logger.error(this.record.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }

  public async initRecord(body: CreateReportDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.game) });
      if (!game) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("game"))

      const record = await this.recordModel.create({
        game,
        level: body.level,
        time: [],
        user: users._id,
      });

      return record;
    } catch (error) {
      this.logger.error(this.initRecord.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
