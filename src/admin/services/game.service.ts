import { ByIdDto } from "@app/common/dto/byId.dto";
import { DefineGameDTO, EditGameDTO, ListGameDTO } from "@app/common/dto/game.dto";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Game } from "@app/common/model/schema/game.schema";
import { User } from "@app/common/model/schema/users.schema";
import { gamePipeline } from "@app/common/pipeline/game.pipeline";
import { ResponseService } from "@app/common/response/response.service";
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class GameAdminService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @Inject(ImagesService) private imageService: ImagesService,
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
      });

      return this.responseService.success(true, StringHelper.successResponse('game', 'define'), game);
    } catch (error) {
      this.logger.error(this.defineGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async editGame(body: EditGameDTO, media: any[], req: any): Promise<any> {
    const user: User = <User>req.user;
    try {
      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.id) }).populate('images');
      delete body.id;
      if (!game) throw new NotFoundException("Game Not Found");

      if (media?.length) {
        if (game.images.length) await this.imageService.delete(game.images);
        game.images = media;
      }

      game.set({ ...body })
      await game.save();

      return this.responseService.success(true, StringHelper.successResponse('game', 'edit'), game);
    } catch (error) {
      this.logger.error(this.editGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteGame(body: ByIdDto): Promise<any> {
    try {
      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.id) }).populate('images');
      if (!game) throw new NotFoundException("Game Not Found");

      if (game.images.length) await this.imageService.delete(game.images)
      game.images = []
      game.deletedAt = new Date();
      await game.save();

      return this.responseService.success(true, StringHelper.successResponse('game', 'delete'));
    } catch (error) {
      this.logger.error(this.deleteGame.name);
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

      let games = await this.gameModel.aggregate(gamePipeline(searchOption)).skip(SKIP).limit(LIMIT_PAGE);

      const total = await this.gameModel.aggregate(gamePipeline(searchOption)).count("total");

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