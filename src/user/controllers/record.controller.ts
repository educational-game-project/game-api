import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Request } from "express";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { CreateReportDto } from "@app/common/dto/report.dto";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Controller, Post, Body, UseGuards, Request as Req } from "@nestjs/common";
import { RecordService } from "src/user/services/record.service";

@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("record")
export class RecordController {
  constructor(private readonly recordService: RecordService) { }

  @Post()
  @ResponseStatusCode()
  async record(@Body() body: CreateReportDto, @Req() req: Request): Promise<any> {
    return this.recordService.record(body, req);
  }
}
