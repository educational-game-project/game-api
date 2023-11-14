import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from 'mongoose';
import { Scores } from '@app/common/model/schema/scores.schema';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Scores.name) private scoresModel: Model<Scores>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(ScoreService.name);
}
