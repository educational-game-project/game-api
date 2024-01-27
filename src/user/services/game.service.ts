import { ListGameByAuthorDTO } from "@app/common/dto/game.dto";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Game } from "@app/common/model/schema/game.schema";
import { ResponseService } from "@app/common/response/response.service";
import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(GameService.name);

  public async getListGame(body: ListGameByAuthorDTO): Promise<any> {
    try {
      const { author } = body;
      const games = await this.gameModel.find({ author }).populate('images');
      if (!games?.length) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('game'))

      return this.responseService.success(true, StringHelper.successResponse('game', 'list'), games);
    } catch (error) {
      this.logger.error(this.getListGame.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}