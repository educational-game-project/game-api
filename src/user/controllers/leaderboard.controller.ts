import { Body, Controller, Post, Request as Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { LeaderboardService } from '../services/leaderboard.service';
import { ByGameIdDTO } from "@app/common/dto/game.dto";

@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("leaderboard")
export class LeaderBoardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  @Post()
  @ResponseStatusCode()
  async getLeaderboard(@Body() body: ByGameIdDTO, @Req() req: Request): Promise<any> {
    return this.leaderboardService.getLeaderboard(body, req);
  }
}
