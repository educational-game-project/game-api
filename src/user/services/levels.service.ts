import { HttpStatus, Inject, Injectable, Logger, Body } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from 'mongoose';
import { Levels } from '@app/common/model/schema/levels.schema';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { getLevelDTO, initLevelDTO } from '@app/common/dto/levels.dto';
import { StringHelper } from '@app/common/helpers/string.helpers';

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Levels.name) private levelsModel: Model<Levels>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(LevelsService.name);

  public async initLevel(body: initLevelDTO, req: Request): Promise<any> {
    try {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let user = await this.usersModel.findOne({ _id: new Types.ObjectId(body.userId) });
      delete body.userId
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('user'));

      let current = await this.levelsModel.findOne({ user: user._id, game: body.game, createdAt: { $gte: today } });
      if (current) return this.responseService.success(true, StringHelper.successResponse('level', 'initiated'), current);

      const level = await this.levelsModel.create({
        ...body,
        isValid: true,
        user: user._id
      });

      return this.responseService.success(true, StringHelper.successResponse('level', 'initiated'), level);
    } catch (error) {
      this.logger.error(this.initLevel.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }

  public async getLevel(body: getLevelDTO, req: Request): Promise<any> {
    try {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let user = await this.usersModel.findOne({ _id: new Types.ObjectId(body.userId) });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('user'));

      let current = await this.levelsModel.findOne({ user: user._id, game: body.game, createdAt: { $gte: today } });
      if (!current) {
        const init = await this.initLevel({ current: 1, max: 3, ...body }, req);
        current = init.data;
      }

      return this.responseService.success(true, StringHelper.successResponse('level', 'initiated'), current);
    } catch (error) {
      this.logger.error(this.getLevel.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }
}
