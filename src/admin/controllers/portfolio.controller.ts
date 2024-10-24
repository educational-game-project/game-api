import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { PortfolioVisitorService } from '../services/portfolio.service';

@Controller('visitor')
export class VisitorController {
  constructor(
    private readonly portfolioVisitorService: PortfolioVisitorService,
  ) { }

  @Post('record')
  @HttpCode(HttpStatus.OK)
  async recordVisitors(@Body() data: any) {
    return await this.portfolioVisitorService.recordVisitors(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getVisitors(@Query() data: any) {
    return await this.portfolioVisitorService.getVisitors(data.start);
  }

  @Get('count')
  @HttpCode(HttpStatus.OK)
  async getVisitorCount() {
    return await this.portfolioVisitorService.getVisitorCount();
  }
}