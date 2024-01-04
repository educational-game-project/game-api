import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { Level } from "@app/common/model/schema/levels.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";

@Injectable()
export class LevelsAdminService {
  constructor(
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @InjectModel(User.name) private serModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(LevelsAdminService.name);
}
