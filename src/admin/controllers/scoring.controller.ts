import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request as Req, Body, } from "@nestjs/common";
import { ScoreAdminService } from "../services/scoring.service";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { ByUserIdDto } from "@app/common/dto/user.dto";

@Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/score")
export class ScoreAdminController {
  constructor(private scoreService: ScoreAdminService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getScore(
    @Body() body: ByUserIdDto,
    @Req() req: Request,
  ) {
    const { userId } = body;

    return this.scoreService.getScores(userId);
  }

}
