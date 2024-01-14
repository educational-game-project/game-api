import { DefineGameDTO, ListGameDTO } from "@app/common/dto/game.dto";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Game } from "@app/common/model/schema/game.schema";
import { User } from "@app/common/model/schema/users.schema";
import { dateToString } from "@app/common/pipeline/dateToString.pipeline";
import { ResponseService } from "@app/common/response/response.service";
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";

@Injectable()
export class GameAdminService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(GameAdminService.name);

  public async defineGame(body: DefineGameDTO, media: any[], req: any): Promise<any> {
    const user: User = <User>req.user;
    try {
      let current = await this.gameModel.findOne({ name: body.name });
      if (current) throw new BadRequestException("Game Already Exist");

      let game = await this.gameModel.create({
        ...body,
        images: media?.length ? media : [],
        addedBy: user,
      })

      return this.responseService.success(true, StringHelper.successResponse('game', 'define'), game);
    } catch (error) {
      this.logger.error(this.defineGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async listGame(body: ListGameDTO): Promise<any> {
    try {
      const searchRegex = new RegExp(body.search?.toString(), "i");
      const LIMIT_PAGE: number = body?.limit ?? 10;
      const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

      let searchOption: any = {
        $or: [
          { name: searchRegex },
          { author: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { maxLevel: searchRegex },
          { "addedBy.name": searchRegex },
        ],
        deletedAt: null,
      };

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "users",
            localField: "addedBy",
            foreignField: "_id",
            as: "addedBy",
            pipeline: [
              {
                $match: { deletedAt: null }
              },
              {
                $lookup: {
                  from: "images",
                  localField: "images",
                  foreignField: "_id",
                  as: "images",
                },
              },
            ]
          }
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        ...dateToString,
        {
          $set: {
            addedBy: { $ifNull: [{ $arrayElemAt: ["$addedBy", 0] }, null] },
          },
        },
        {
          $match: searchOption,
        },
        {
          $sort: { createdAt: -1 },
        },
      ]

      let games = await this.gameModel.aggregate(pipeline).skip(SKIP).limit(LIMIT_PAGE);

      const total = await this.gameModel.aggregate(pipeline).count("total");

      return this.responseService.paging(
        StringHelper.successResponse("game", "list"),
        games,
        {
          totalData: Number(total[0]?.total) ?? 0,
          perPage: LIMIT_PAGE,
          currentPage: body?.page ?? 1,
          totalPage: Math.ceil(total[0]?.total ?? 0 / LIMIT_PAGE),
        },
      );
    } catch (error) {
      this.logger.error(this.listGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}