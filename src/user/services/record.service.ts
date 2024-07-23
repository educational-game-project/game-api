import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { Record } from "@app/common/model/schema/records.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { CreateReportDTO } from "@app/common/dto/report.dto";
import { Game } from "@app/common/model/schema/game.schema";
import { Level } from "@app/common/model/schema/levels.schema";
import { LevelsService } from "./levels.service";
import { ScoreService } from "./scoring.service";
import { StatusRecord } from "@app/common/enums/statusRecord.enum";
import { ReportType } from "@app/common/enums/reportType.enum";
import { LogsService } from "src/admin/services/log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(LevelsService) private readonly levelsService: LevelsService,
    @Inject(ScoreService) private readonly scoreService: ScoreService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(RecordService.name);

  public async record(body: CreateReportDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("user"));

      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.game) });
      if (!game) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("game"))

      let currentLevel = await this.levelsService.getLevel({ id: body.game }, req)
      currentLevel = currentLevel.data;

      let current = await this.recordModel.findOne({
        user: user._id,
        game: game._id,
        level: currentLevel.current,
        isValid: { $eq: true },
      });

      if (!current) {
        body.level = currentLevel.current;
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
          if (currentLevel.current !== currentLevel.max) {
            await this.levelModel.findOneAndUpdate({ _id: currentLevel?._id }, { $inc: { current: 1 } });
          } else {
            await this.levelModel.findOneAndUpdate({ _id: currentLevel?._id }, { $set: { isValid: false } });
          }
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

      if (!current.isValid) await this.scoreService.calculateScore(current?._id, req);

      await this.logsService.logging({
        target: TargetLogEnum.RECORD,
        description: `${users?.name} success add record of game ${game?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("record", "add"), current);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.RECORD,
        description: `${users?.name} success add record of game `,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.record.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }

  public async initRecord(body: CreateReportDTO, req: any): Promise<any> {
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

      await this.logsService.logging({
        target: TargetLogEnum.RECORD,
        description: `${users?.name} success init record of game ${game?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return record;
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.RECORD,
        description: `${users?.name} failed init record of game `,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.initRecord.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
