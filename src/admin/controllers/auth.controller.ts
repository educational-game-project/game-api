import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthAdminService } from '../services/auth.service';
import { LoginUserDto } from '@app/common/dto/auth.dto';

@Controller('admin/auth')
export class AuthAdminController {
  constructor(
    private readonly authService: AuthAdminService
  ) { }

}
