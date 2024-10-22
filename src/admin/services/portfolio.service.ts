import { StringHelper } from "@app/common/helpers/string.helpers";
import { PortfolioVisitor } from "@app/common/model/schema/visitors.schema";
import { ResponseService } from "@app/common/response/response.service";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import moment from "moment-timezone";

@Injectable()
export class PortfolioVisitorService {
  constructor(
    @InjectModel(PortfolioVisitor.name) private portfolioVisitorsModel: Model<PortfolioVisitor>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(PortfolioVisitorService.name);

  async recordVisitors(data: any) {
    try {
      let today = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
      await this.portfolioVisitorsModel.create({
        ...data,
        ipAddress: data.ip,
        date: today,
      });

      return this.responseService.success(true, StringHelper.successResponseAdmin("Visitor", "Record"));
    } catch (error) {
      this.logger.error(this.recordVisitors.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}