import { Body, Controller, HttpCode, HttpStatus, Post, Request as Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { LevelsService } from "../services/levels.service";
import { InitLevelDTO } from "@app/common/dto/levels.dto";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { ByIdDTO } from "@app/common/dto/byId.dto";

@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("levels")
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService
  ) { }

  @Post("init")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async initLevel(@Body() body: InitLevelDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.initLevel(body, req);
  }

  @Post("find")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getLevel(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.getLevel(body, req);
  }
}
