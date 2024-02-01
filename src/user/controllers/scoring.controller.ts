import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Controller, Get, Post, Body, Patch, Param, Delete, Request as Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ScoreService } from "src/user/services/scoring.service";

@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("score")
export class ScoreController {
  constructor(private scoreService: ScoreService) { }

  @Post("leaderboard")
  @ResponseStatusCode()
  async initLevel(@Body() body: any, @Req() req: Request): Promise<any> {
    return this.scoreService.getLeaderBoard(body, req);
  }
}
