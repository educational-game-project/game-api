import { HttpStatus, Inject, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAdminDto } from '@app/common/dto/auth.dto';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { UserRole } from '@app/common/enums/role.enum';
import { AuthHelper } from '@app/common/helpers/auth.helper';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) { }

  private readonly logger = new Logger(AuthAdminService.name);

  public async login(body: LoginAdminDto): Promise<any> {
    try {
      let q: any = {
        role: { $ne: UserRole.USER }
      }
      if (body.email) q.email = body.email
      if (body.phoneNumber) q.phoneNumber = body.phoneNumber
      let user = await this.usersModel.findOne(q).select("+password").populate('images');
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('user'));

      // Check password
      const isMatchPassword = this.authHelper.isPasswordValid(body.password, user.password);
      if (!isMatchPassword) return this.responseService.error(HttpStatus.CONFLICT, `password ${body.email} is incorrect`);

      user = user.toObject()
      delete user.password

      const tokens = await this.authHelper.generateTokens(user?._id, { role: user.role, email: user?.email, phoneNumber: user?.phoneNumber });

      return this.responseService.success(true, StringHelper.successResponse('auth', 'login'), { user, tokens });
    } catch (error) {
      this.logger.error(this.login.name);
      console.log(error)
      throw new InternalServerErrorException(error);
    }
  }
}
