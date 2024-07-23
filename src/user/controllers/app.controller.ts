import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "src/user/services/app.service";

@ApiTags("Default")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getHello(): Promise<any> {
    return await this.appService.getHello();
  }
}
