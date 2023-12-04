import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '@app/common/dto/auth.dto';
import { ResponseStatusCode } from '@app/common/response/response.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ResponseStatusCode()
  async login(@Body() body: LoginUserDto): Promise<any> {
    return this.authService.login(body);
  }
}
