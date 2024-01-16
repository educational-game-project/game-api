import { HttpStatus, Inject, Injectable, Logger, NotFoundException, BadRequestException, HttpException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginAdminDto, ReauthDto } from "@app/common/dto/auth.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
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

      await this.userModel.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

      return this.responseService.success(true, StringHelper.successResponse("auth", "login"), { user, tokens },);
    } catch (error) {
      this.logger.error(this.login.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  public async verifyRefreshToken(body: ReauthDto, req: any): Promise<any> {
    try {
      let { refreshToken } = body;

      let { isValid, user } = await this.authHelper.validate(refreshToken);

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
        return this.responseService.success(true, StringHelper.successResponse("auth", "verifyRefreshToken"), { user, tokens });
      }
    } catch (error) {
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

      return this.responseService.success(true, StringHelper.successResponse("auth", "changePassword"));
    } catch (error) {
      this.logger.error(this.changePassword.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }

  public async logout(req: any): Promise<any> {
    try {
      let user = <User>req.user;
      console.log(user)
      await this.authHelper.logout(user);
      return this.responseService.success(true, StringHelper.successResponse("auth", "logout"));
    } catch (error) {
      this.logger.error(this.logout.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }
}
