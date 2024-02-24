import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { Score } from "@app/common/model/schema/scores.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";

@Injectable()
export class ScoreAdminService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(ScoreAdminService.name);

  async getScores(userId: string) {
    try {
      const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });
      if (!user) throw new HttpException(StringHelper.notFoundResponse('user'), HttpStatus.BAD_REQUEST);

      let pipeline: PipelineStage[] = [
        {
          $match: {
            user: user._id
          }
        },
        {
          $lookup: {
            from: "games",
            localField: "game",
            foreignField: "_id",
            as: "game",
          },
        },
        {
          $set: {
            game: {
              $ifNull: [
                { $arrayElemAt: ["$game", 0] },
                null,
              ],
            },
          },
        },
        {
          $project: {
            record: 0,
            user: 0,
          },
        },
        {
          $sort: {
            createdAt: 1
          }
        },
        {
          $group: {
            _id: "$game",
            scores: {
              $push: {
                level: "$level",
                value: "$value",
                createdAt: "$createdAt"
              }
            },
          },
        },
      ];

      let result = await this.scoreModel.aggregate(pipeline);

      if (result.length) result.map((item) => {
        item.game = item._id;
        delete item._id;
        return item;
      })

      return this.responseService.success(true, StringHelper.successResponse('get', 'score'), result);
    } catch (error) {
      this.logger.error(this.getScores.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
