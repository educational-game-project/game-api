import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Level } from "@app/common/model/schema/levels.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { InitLevelDTO } from "@app/common/dto/levels.dto";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { TimeHelper } from "@app/common/helpers/time.helper";
import { ByIdDto } from "@app/common/dto/byId.dto";
import { Game } from "@app/common/model/schema/game.schema";
import { userPopulate } from "@app/common/pipeline/user.pipeline";
import { gamePopulate } from "@app/common/pipeline/game.pipeline";
import { LogsService } from "src/admin/services/log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(LevelsService.name);

  public async initLevel(body: InitLevelDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("user"));

      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.game) });
      if (!game) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("game"))

      let currentLevel = await this.levelModel.findOne({
        user: user._id,
        game: game._id,
        isValid: true,
        createdAt: { $gte: TimeHelper.getToday() },
      }).populate([...userPopulate, ...gamePopulate]);

      if (currentLevel) return this.responseService.success(true, StringHelper.successResponse("level", "initiated"), currentLevel);

      const level = await this.levelModel.create({
        current: 1,
        max: game?.maxLevel,
        liveLeft: game?.maxRetry ?? 3,
        game,
        isValid: true,
        user: user._id,
      });

      await this.logsService.logging({
        target: TargetLogEnum.LEVEL,
        description: `${users?.name} success init level of game ${game?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      await level.populate([...userPopulate, ...gamePopulate])
      return this.responseService.success(true, StringHelper.successResponse("level", "initiated"), level);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.LEVEL,
        description: `${users?.name} success init level of game `,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.initLevel.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }

  public async getLevel(body: ByIdDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("user"));

      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(body.id) });
      if (!game) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("game"))

      let currentLevel = await this.levelModel.findOne({
        user: user._id,
        game: game._id,
        isValid: true,
        createdAt: { $gte: TimeHelper.getToday() },
      }).populate([...userPopulate, ...gamePopulate]);

      if (!currentLevel) {
        const init = await this.initLevel({ game: body.id }, req);
        currentLevel = init.data;
      }

      await this.logsService.logging({
        target: TargetLogEnum.LEVEL,
        description: `${users?.name} success get level of game ${game?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("level", "initiated"), currentLevel);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.LEVEL,
        description: `${users?.name} failed get level`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.getLevel.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
