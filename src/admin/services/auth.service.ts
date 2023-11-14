import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from 'mongoose';
import { LoginAdminDto } from '@app/common/dto/auth.dto';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { UserRole } from '@app/common/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  private readonly logger = new Logger(AuthAdminService.name);

  public async login(body: LoginAdminDto): Promise<any> {
    try {
      let q: any = {
        role: { ne: UserRole.USER }
      }
      if (body.email) q.email = body.email
      if (body.phoneNumber) q.phoneNumber = body.phoneNumber
      let user = await this.usersModel.findOne(q);
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('user'));

      // Check password
      const isMatchPassword = await bcrypt.compare(body.password, user?.password);
      if (!isMatchPassword) return this.responseService.error(HttpStatus.CONFLICT, `password ${body.email} is incorrect`);

      const tokens = await this.getTokens(user?._id, { role: user.role, email: user?.email, phoneNumber: user?.phoneNumber });

      return this.responseService.success(true, StringHelper.successResponse('auth', 'login'), { user, tokens });
    } catch (error) {
      this.logger.error(this.login.name);
      console.log(error)
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' })
    }
  }

  private async getTokens(userId: mongoose.Types.ObjectId, data: { role: string, email?: string, phoneNumber?: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          ...data,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          ...data,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
