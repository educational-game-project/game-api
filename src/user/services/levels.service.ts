import { HttpStatus, Inject, Injectable, Logger, Body } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Level } from "@app/common/model/schema/levels.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { initLevelDTO } from "@app/common/dto/levels.dto";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { TimeHelper } from "@app/common/helpers/time.helper";
import { GameNameDTO } from "@app/common/dto/global.dto";

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) {}

  private readonly logger = new Logger(LevelsService.name);

  public async initLevel(body: initLevelDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user)
        return this.responseService.error(
          HttpStatus.NOT_FOUND,
          StringHelper.notFoundResponse("user"),
        );

      let currentLevel = await this.levelModel.findOne({
        user: user._id,
        game: body.game,
        isValid: true,
        createdAt: { $gte: TimeHelper.getToday() },
      });
      if (currentLevel)
        return this.responseService.success(
          true,
          StringHelper.successResponse("level", "initiated"),
          currentLevel,
        );

      const level = await this.levelModel.create({
        ...body,
        isValid: true,
        user: user._id,
      });

      return this.responseService.success(
        true,
        StringHelper.successResponse("level", "initiated"),
        level,
      );
    } catch (error) {
      this.logger.error(this.initLevel.name);
      console.log(error);
      return this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        StringHelper.internalServerError,
        { value: error, constraint: "", property: "" },
      );
    }
  }

  public async getLevel(body: GameNameDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user)
        return this.responseService.error(
          HttpStatus.NOT_FOUND,
          StringHelper.notFoundResponse("user"),
        );

      let currentLevel = await this.levelModel.findOne({
        user: user._id,
        game: body.game,
        isValid: true,
        createdAt: { $gte: TimeHelper.getToday() },
      });
      if (!currentLevel) {
        const init = await this.initLevel({ current: 1, max: 3, ...body }, req);
        currentLevel = init.data;
      }

      return this.responseService.success(
        true,
        StringHelper.successResponse("level", "initiated"),
        currentLevel,
      );
    } catch (error) {
      this.logger.error(this.getLevel.name);
      console.log(error);
      return this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        StringHelper.internalServerError,
        { value: error, constraint: "", property: "" },
      );
    }
  }

  public async updateLevel(body: GameNameDTO, req: any) {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user)
        return this.responseService.error(
          HttpStatus.NOT_FOUND,
          StringHelper.notFoundResponse("user"),
        );

      let currentLevel = await this.levelModel.findOne({
        user: user._id,
        game: body.game,
        isValid: true,
        createdAt: { $gte: TimeHelper.getToday() },
      });
      if (!currentLevel) {
        const init = await this.initLevel({ current: 1, max: 3, ...body }, req);
        currentLevel = init.data;
      }

      currentLevel.current === currentLevel.max
        ? (currentLevel.isValid = false)
        : currentLevel.current++;
      currentLevel = await currentLevel.save();

      return this.responseService.success(
        true,
        StringHelper.successResponse("level", "update"),
        currentLevel,
      );
    } catch (error) {
      this.logger.error(this.updateLevel.name);
      console.log(error);
      return this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        StringHelper.internalServerError,
        { value: error, constraint: "", property: "" },
      );
    }
  }
}
