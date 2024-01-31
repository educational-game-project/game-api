import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { Score } from "@app/common/model/schema/scores.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Record } from "@app/common/model/schema/records.schema";
import { ScoreCalculateHelper } from "@app/common/helpers/score.helper";

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(ScoreCalculateHelper) private readonly scoreCalculateHelper: ScoreCalculateHelper,
  ) { }

  private readonly logger = new Logger(ScoreService.name);

  public async calculateScore(recordId: any): Promise<any> {
    try {
      let record = await this.recordModel.findOne({ _id: recordId });
      if (!record) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("record"));

      let calcScore: number = await this.scoreCalculateHelper.calculateScore(record.game, {
        timeInSeconds: record.time.pop(),
        level: record.level,
        tryCount: record.count,
        lifeLeftBonus: record.liveLeft,
      });

      let score = await this.scoreModel.create({
        value: calcScore,
        level: record.level,
        user: record.user,
        game: record.game,
        record: record._id,
      });

      return this.responseService.success(true, StringHelper.successResponse("score", 'calculate'), score);
    } catch (error) {
      this.logger.error(this.calculateScore.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
