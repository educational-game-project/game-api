import { HttpStatus, Inject, Injectable, Logger, NotFoundException, BadRequestException, HttpException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginAdminDto, ReauthDto } from "@app/common/dto/auth.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { LogsService } from "./log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(AuthAdminService.name);

  public async login(body: LoginAdminDto): Promise<any> {
    try {
      let q: any = { role: { $ne: UserRole.USER }, };
      if (body.email) q.email = body.email;
      if (body.phoneNumber) q.phoneNumber = body.phoneNumber;
      let user = await this.userModel.findOne(q).select("+password").populate("image");
      if (!user) throw new NotFoundException("User Not Found!")

      // Check password
      const isMatchPassword = this.authHelper.isPasswordValid(body.password, user.password,);
      if (!isMatchPassword) throw new BadRequestException("Password is incorrect!")

      user = user.toObject();
      delete user.password;

      const tokens = await this.authHelper.generateTokens(user?._id, {
        name: user?.name,
        role: user?.role,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
      });

      await this.userModel.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken, isActive: true } });

      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user.name} login into admin dashboard`,
        success: true,
        summary: JSON.stringify(body),
        actor: user._id.toString(),
      })

      return this.responseService.success(true, StringHelper.successResponse("auth", "login"), { user, tokens },);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${body.email} failed login into admin dashboard`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.login.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  public async verifyRefreshToken(body: ReauthDto, req: any): Promise<any> {
    let { refreshToken } = body;
    let { isValid, user } = await this.authHelper.validate(refreshToken);

    try {
      if (!user) user = await this.userModel.findOne({ refreshToken })

      if (user) {
        user = user.toObject();
        delete user.password;

        const tokens = await this.authHelper.generateTokens(user?._id, {
          name: user?.name,
          role: user?.role,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
        });
        await this.userModel.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

        await this.logsService.logging({
          target: TargetLogEnum.AUTH,
          description: `${user.name} reverify refresh token`,
          success: true,
          summary: JSON.stringify(body),
          actor: user._id.toString(),
        })

        return this.responseService.success(true, StringHelper.successResponse("auth", "verifyRefreshToken"), { user, tokens });
      }
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user?.name} failed reverify refresh token`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.verifyRefreshToken.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  public async changePassword(body: any, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let { oldPassword, newPassword } = body;
      let user = await this.userModel.findById(users._id).select("+password");
      if (!user) throw new NotFoundException("User Not Found!")

      // Check password
      const isMatchPassword = this.authHelper.isPasswordValid(oldPassword, user.password,);
      if (!isMatchPassword) throw new BadRequestException("Password is incorrect!")

      user.password = this.authHelper.encodePassword(newPassword);
      await user.save();

      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${users?.name} success change password`,
        success: true,
      })

      return this.responseService.success(true, StringHelper.successResponse("auth", "changePassword"));
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${users?.name} failed change password`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.changePassword.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  public async logout(req: any): Promise<any> {
    let user = <User>req.user;
    try {
      await this.authHelper.logout(user);

      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user?.name} logout successfully.`,
        success: true,
      })

      return this.responseService.success(true, StringHelper.successResponse("auth", "logout"));
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user?.name} failed to logout`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.logout.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }
}
