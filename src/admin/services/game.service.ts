import { DefineGameDTO } from "@app/common/dto/game.dto";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { Game } from "@app/common/model/schema/game.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

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
}