import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { Record } from "@app/common/model/schema/records.schema";
import { ResponseService } from "@app/common/response/response.service";

@Injectable()
export class RecordAdminService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(RecordAdminService.name);
}
