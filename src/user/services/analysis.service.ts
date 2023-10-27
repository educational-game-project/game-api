import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from '@app/common/response/response.service';
import mongoose, {
  Model,
  PipelineStage,
  Types,
  isValidObjectId,
} from 'mongoose';
import {
  CreateAnalysisDto,
  UpdateAnalysisDto,
} from '@app/common/dto/analysis.dto';
import { Users } from '@app/common/model/schema/users.schema';
import { Analysis } from '@app/common/model/schema/analysis.schema';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel(Analysis.name) private AnalysisModel: Model<Analysis>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(AnalysisService.name);

  create(createAnalysisDto: CreateAnalysisDto) {
    return 'This action adds a new analysis';
  }

  findAll() {
    return `This action returns all analysis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analysis`;
  }

  update(id: number, updateAnalysisDto: UpdateAnalysisDto) {
    return `This action updates a #${id} analysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} analysis`;
  }
}
