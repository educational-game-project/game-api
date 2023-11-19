import { ResponseStatusCode } from '@app/common/response/response.decorator';
import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/user/services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ResponseStatusCode()
  async getHello(): Promise<any> {
    return await this.appService.getHello();
  }
}
