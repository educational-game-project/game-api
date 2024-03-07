import { ByIdDto } from "@app/common/dto/byId.dto";
import { SearchDTO } from "@app/common/dto/search.dto";
import { TargetLogEnum } from "@app/common/enums/log.enum";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { ILogsData, Log } from "@app/common/model/schema/log.schema";
import { User } from "@app/common/model/schema/users.schema";
import { logsPipeline } from "@app/common/pipeline/logs.pipeline";
import { ResponseService } from "@app/common/response/response.service";
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model, Types } from "mongoose";

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private logsModel: Model<Log>,
    @InjectModel(User.name) private usersModel: Model<User>,

    @Inject(REQUEST) private request: Request,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) { }

  private readonly logger = new Logger(LogsService.name);

  async logging(data: ILogsData) {
    try {
      const userAgent = this.request?.headers['user-agent'];
      const auth = this.request?.headers['authorization']?.split(' ')[1];
      let user;
      if (auth) {
        let decoded = this.authHelper.validateToken(auth);
        user = await this.authHelper.validateUser(decoded);
        await this.usersModel.updateOne({ _id: user._id }, { isActive: true });
      } else {
        user = data?.actor ? await this.usersModel.findOne({ _id: new Types.ObjectId(data.actor) }) : null;
      }

      await this.logsModel.create({
        actor: user?._id ?? null,
        target: data?.target,
        type: data?.type ?? 'Action',
        method: this.request?.method,
        userAgent,
        description: data?.description,
        summary: data?.summary ?? null,
        success: data?.success ?? true,
      });
    } catch (error) {
      this.logger.error(this.logging.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLogs(body: SearchDTO, req: any) {
    try {
      const searchRegex = new RegExp(body.search?.toString(), "i");
      const LIMIT_PAGE: number = body?.limit ?? 10;
      const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

      let searchOption: any = {
        $or: [
          { 'actor.name': searchRegex },
          { target: searchRegex },
          { method: searchRegex },
          { userAgent: searchRegex },
          { description: searchRegex },
          { summary: searchRegex },
        ],
        deletedAt: null,
      }

      if (body?.status !== undefined) searchOption.status = body.status

      if (req?.user?.role === UserRole.ADMIN) {
        searchOption["actor.school._id"] = new Types.ObjectId(req?.user?.school)
      }

      let logs = await this.logsModel.aggregate(logsPipeline(searchOption, SKIP, LIMIT_PAGE));
      const total = await this.logsModel.aggregate(logsPipeline(searchOption)).count("total");

      return this.responseService.paging(StringHelper.successResponse("log", "list"),
        logs,
        {
          totalData: Number(total[0]?.total) ?? 0,
          perPage: LIMIT_PAGE,
          currentPage: body?.page ?? 1,
          totalPage: Math.ceil((Number(total[0]?.total) ?? 0) / LIMIT_PAGE),
        },
      )
    } catch (error) {
      this.logger.error(this.getLogs.name);
      this.logging({ target: TargetLogEnum.LOG, description: `${req?.user?.name} failed get logs.`, success: false, summary: JSON.stringify(body) })
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteLog(body: ByIdDto, req: any) {
    try {
      let log = await this.logsModel.findOne({ _id: body.id })
      if (!log) throw new NotFoundException("Log Not Found");
      await this.logsModel.updateOne({ _id: body.id }, { deletedAt: new Date() });

      return this.responseService.success(true, StringHelper.successResponse("log", "delete"));
    } catch (error) {
      this.logger.error(this.deleteLog.name);
      this.logging({ target: TargetLogEnum.LOG, description: `${req?.user?.name} failed delete logs.`, success: false, summary: JSON.stringify(body) })
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}