import { AuthHelper } from "@app/common/helpers/auth.helper";
import { Log } from "@app/common/model/schema/log.schema";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model } from "mongoose";

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private logsModel: Model<Log>,
    @InjectModel(User.name) private usersModel: Model<User>,

    @Inject(REQUEST) private request: Request,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    private jwtService: JwtService,
    private authHelper: AuthHelper,
  ) { }

  private readonly logger = new Logger(LogsService.name);


  async logging(target: string, description: string, summary: string, type?: string, success?: boolean) {
    try {
      const url = this.request?.headers['access-route'];
      const origin = this.request?.headers['origin'];
      const userAgent = this.request?.headers['user-agent'];
      const auth = this.request?.headers['authorization']?.split(' ')[1];
      const decoded = this.authHelper.validateToken(auth);
      const user = await this.authHelper.validateUser(decoded);

      await this.logsModel.create({
        actor: user._id,
        target,
        type: type ?? 'Action',
        url: `${origin}${url}`,
        method: this.request?.method,
        userAgent,
        description,
        summary,
        success: success ?? true,
      });
    } catch (error) {
      this.logger.error(this.logging.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}