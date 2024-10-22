import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
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
}