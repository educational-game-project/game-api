import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { Record, StatusRecord } from "@app/common/model/schema/records.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { CreateReportDto, ReportType } from "@app/common/dto/report.dto";

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) {}

  private readonly logger = new Logger(RecordService.name);

  public async record(body: CreateReportDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id });
      if (!user)
        return this.responseService.error(
          HttpStatus.NOT_FOUND,
          StringHelper.notFoundResponse("user"),
        );

      let current = await this.recordModel.findOne({
        user: user._id,
        game: body.game,
        level: body.level,
        isValid: true,
      });
      if (!current) current = await this.initRecord(body, req);

      switch (body.type) {
        case ReportType.SUCCESS:
          current.status = StatusRecord.PASSED;
          current.isValid = false;
          break;

        case ReportType.FAILED:
          if (current.liveLeft === 0) {
            current.isValid = false;
            current.status = StatusRecord.FAILED;
          } else {
            current.liveLeft--;
          }
          break;
      }

      current.count++;
      current.time.push(body.time);
      current = await current.save();

      return this.responseService.success(
        true,
        StringHelper.successResponse("record", "add"),
        current,
      );
    } catch (error) {
      this.logger.error(this.record.name);
      console.log(error);
      return this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        StringHelper.internalServerError,
        { value: error, constraint: "", property: "" },
      );
    }
  }

  public async initRecord(body: CreateReportDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      const record = await this.recordModel.create({
        game: body.game,
        level: body.level,
        time: [],
        user: users._id,
      });

      return record;
    } catch (error) {
      this.logger.error(this.initRecord.name);
      console.log(error);
      return this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        StringHelper.internalServerError,
        { value: error, constraint: "", property: "" },
      );
    }
  }
}
