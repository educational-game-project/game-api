import { Request, Controller, Post, Body } from '@nestjs/common';
import { AuthAdminService } from '../services/auth.service';
import { LoginAdminDto } from '@app/common/dto/auth.dto';
import { ResponseStatusCode } from '@app/common/response/response.decorator';

@Controller('admin/auth')
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) {}

  @Post('login')
  @ResponseStatusCode()
  async login(@Body() body: LoginAdminDto, @Request() req) {
    return this.authService.login(body);
  }
}
