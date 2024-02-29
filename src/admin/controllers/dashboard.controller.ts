import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Controller, Get, HttpCode, HttpStatus, Logger, Request, UseGuards } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/dashboard")
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) { }

  private readonly logger = new Logger(DashboardController.name);

  @Get()
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  getDashboard(@Request() req: any) {
    return this.dashboardService.getDashboardInfo(req.user)
  }
}