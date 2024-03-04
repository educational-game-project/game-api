import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Request as Req, UseGuards } from "@nestjs/common";
import { LogsService } from "../services/log.service";
import { UserRole } from "@app/common/enums/role.enum";
import { Roles } from "@app/common/decorators/roles.decorator";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Request } from "express";
import { SearchDTO } from "@app/common/dto/search.dto";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ByIdDto } from "@app/common/dto/byId.dto";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
@Controller('admin/logs')
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getLogs(@Body() body: SearchDTO, @Req() req: Request) {
    return await this.logsService.getLogs(body, req);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async deleteLog(@Body() body: ByIdDto, @Req() req: Request) {
    return await this.logsService.deleteLog(body, req);
  }
}