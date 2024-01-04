import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage, Types, isValidObjectId } from "mongoose";
import { CreateReportDto, UpdateReportDto } from "@app/common/dto/report.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";

@Injectable()
export class ReportAdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(ReportAdminService.name);

  create(createReportDto: CreateReportDto) {
    return "This action adds a new report";
  }

  findAll() {
    return `This action returns all report`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
