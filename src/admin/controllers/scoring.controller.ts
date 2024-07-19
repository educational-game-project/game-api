import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request as Req, Body, } from "@nestjs/common";
import { ScoreAdminService } from "../services/scoring.service";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { ByUserIdDTO } from "@app/common/dto/user.dto";
import { ByGameIdDTO } from "@app/common/dto/game.dto";
import { ByUserIdAndGameIdDTO } from "@app/common/dto/byId.dto";

@Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/score")
export class ScoreAdminController {
  constructor(
    private scoreService: ScoreAdminService
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getScore(
    @Body() body: ByUserIdDTO,
    @Req() req: Request,
  ) {
    const { userId } = body;

    return this.scoreService.getScores(userId, req);
  }

  @Post('chart')
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getScoresChartData(
    @Body() body: ByUserIdAndGameIdDTO,
    @Req() req: Request,
  ) {
    const { userId, gameId } = body;

    return this.scoreService.getScoresChartData(userId, gameId, req);
  }

  @Post('leaderboard')
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getleaderboard(
    @Body() body: ByGameIdDTO,
    @Req() req: Request,
  ) {
    const { gameId } = body;

    return this.scoreService.getLeaderboard(gameId, req);
  }
}
