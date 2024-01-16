import { Request, Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthAdminService } from "../services/auth.service";
import { LoginAdminDto, ReauthDto } from "@app/common/dto/auth.dto";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";

@Controller("admin/auth")
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) { }

  @Post("login")
  @ResponseStatusCode()
  async login(@Body() body: LoginAdminDto) {
    return this.authService.login(body);
  }

  @Post("refresh-token")
  @ResponseStatusCode()
  async verifyRefreshToken(@Body() body: ReauthDto, @Request() req) {
    return this.authService.verifyRefreshToken(body, req);
  }

  @Post('change-password')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  async changePassword(@Body() body: any, @Request() req) {
    return this.authService.changePassword(body, req);
  }
}
