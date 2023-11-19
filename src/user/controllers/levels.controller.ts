import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Logger, Post, Put, Request as Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { LevelsService } from '../services/levels.service';
import { getLevelDTO, initLevelDTO } from '@app/common/dto/levels.dto';
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ResponseStatusCode } from "@app/common/response/response.decorator";

@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('levels')
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService
  ) { }

  @Post('init')
  @ResponseStatusCode()
  async initLevel(@Body() body: initLevelDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.initLevel(body, req)
  }

  @Post('find')
  @ResponseStatusCode()
  async getLevel(@Body() body: getLevelDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.getLevel(body, req)
  }
}
