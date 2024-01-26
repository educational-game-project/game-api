import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { Score } from "@app/common/model/schema/scores.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Record } from "@app/common/model/schema/records.schema";

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(ScoreService.name);

  public async calculateScore(recordId: any): Promise<any> {
    try {
      let record = await this.recordModel.findOne({ _id: recordId });
      if (!record) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("record"));

      let user = await this.userModel.findOne({ _id: record.user });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("user"));

      let score = await this.scoreModel.findOne({ user: user._id, game: record.game });
      if (!score) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("score"));

      return this.responseService.success(true, StringHelper.successResponse("score", 'init'), score);

    } catch (error) {
      this.logger.error(this.calculateScore.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
