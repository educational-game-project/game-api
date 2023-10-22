import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Model,
  PipelineStage,
  Types,
  isValidObjectId,
} from 'mongoose';
import { Levels } from '@app/common/model/schema/levels.schema';
import { Users } from '@app/common/model/schema/users.schema';

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Levels.name) private levelsModel: Model<Levels>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) {}

  private readonly logger = new Logger(LevelsService.name);
}
