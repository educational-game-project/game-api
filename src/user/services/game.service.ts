import { ListGameByAuthorDTO } from "@app/common/dto/game.dto";
import { TargetLogEnum } from "@app/common/enums/log.enum";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Game } from "@app/common/model/schema/game.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LogService } from "src/admin/services/log.service";

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(LogService) private readonly logService: LogService,
  ) { }

  private readonly logger = new Logger(GameService.name);

  public async getListGame(body: ListGameByAuthorDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      const { author } = body;
      const games = await this.gameModel.find({ author }).populate('images');
      if (!games?.length) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('game'))

      await this.logService.logging({
        target: TargetLogEnum.GAME,
        description: `${users?.name} success get list game`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse('game', 'list'), games);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.GAME,
        description: `${users?.name} failed to get list game`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.getListGame.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}