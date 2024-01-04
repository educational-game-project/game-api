import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { Score } from "@app/common/model/schema/scores.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";

@Injectable()
export class ScoreAdminService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(ScoreAdminService.name);
}
