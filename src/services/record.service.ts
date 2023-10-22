import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Model,
  PipelineStage,
  Types,
  isValidObjectId,
} from 'mongoose';
import { Users } from '@app/common/model/schema/users.schema';
import { Records } from '@app/common/model/schema/records.schema';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(Records.name) private recordsModel: Model<Records>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) {}

  private readonly logger = new Logger(RecordService.name);
}
