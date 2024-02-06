import { Controller, Post, Body, Request, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginUserDto, ReauthDto } from "@app/common/dto/auth.dto";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async login(@Body() body: LoginUserDto): Promise<any> {
    return this.authService.login(body);
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async verifyRefreshToken(@Body() body: ReauthDto, @Request() req) {
    return this.authService.verifyRefreshToken(body, req);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Roles([UserRole.USER])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  async logout(@Request() req) {
    return this.authService.logout(req);
  }
}
