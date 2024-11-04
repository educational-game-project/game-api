import { StringHelper } from "@app/common/helpers/string.helpers";
import { PortfolioVisitor } from "@app/common/model/schema/visitors.schema";
import { ResponseService } from "@app/common/response/response.service";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class PortfolioVisitorService {
  constructor(
    @InjectModel(PortfolioVisitor.name) private portfolioVisitorsModel: Model<PortfolioVisitor>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(PortfolioVisitorService.name);

  async recordVisitors(data: any) {
    try {
      // get latest number
      const latest = await this.portfolioVisitorsModel.find({}).sort({ number: -1 }).limit(1);

      await this.portfolioVisitorsModel.create({
        ...data,
        ipAddress: data.ip,
        date: new Date().toLocaleString(),
        isUpdated: !!data?.ipType,
        number: latest.length > 0 ? latest[0].number + 1 : 1
      });

      return this.responseService.success(true, StringHelper.successResponseAdmin("Visitor", "Record"));
    } catch (error) {
      this.logger.error(this.recordVisitors.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getVisitors(number: number) {
    try {
      const data = await this.portfolioVisitorsModel.find({ number: { $gte: number } })

      return this.responseService.success(true, StringHelper.successResponseAdmin("Visitor", "Get"), data);
    } catch (error) {
      this.logger.error(this.getVisitors.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getVisitorCount() {
    try {
      // get latest number
      const latest = await this.portfolioVisitorsModel.find({}).sort({ number: -1 }).limit(1);

      return this.responseService.success(true, StringHelper.successResponseAdmin("Visitor Count", "Get"), { count: latest.length > 0 ? latest[0].number + 1 : 0 });
    } catch (error) {
      this.logger.error(this.getVisitorCount.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}