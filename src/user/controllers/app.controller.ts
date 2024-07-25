import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
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
  @ApiOperation({
    summary: "Get Default",
    description: "Get Default",
    tags: ["Default"],
    operationId: "Get-Hello"
  })
  @ApiOkResponse({
    description: "Get Hello successfully",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 200,
        },
        success: {
          type: "boolean",
          example: true,
        },
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "Welcome to Game API. Created by Iwan Suryaningrat.",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 500,
        },
        status: {
          type: "string",
          example: "error",
        },
        message: {
          type: "string",
          example: "Internal Server Error",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    }
  })
  async getHello(): Promise<any> {
    return await this.appService.getHello();
  }
}
