import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginUserDto, ReauthDto } from "@app/common/dto/auth.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { globalPopulate } from "@app/common/pipeline/global.populate";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  public async login(body: LoginUserDto): Promise<any> {
    try {
      let user = await this.userModel.findOne({ name: body.name, role: UserRole.USER }).populate(globalPopulate({
        school: true,
        user: false,
        addedBy: false,
        image: true,
        images: false,
        admins: false,
      }));
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse("user"));

      const tokens = await this.authHelper.generateTokens(user._id, { name: user.name, role: user.role });
      await this.userModel.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken, isActive: true } });

      return this.responseService.success(true, StringHelper.successResponse("user", "login"), { user, tokens });
    } catch (error) {
      this.logger.error(this.login.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
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

        const tokens = await this.authHelper.generateTokens(user._id, { name: user.name, role: user.role });
        await this.userModel.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });
        return this.responseService.success(true, StringHelper.successResponse("auth", "verifyRefreshToken"), { user, tokens });
      }
    } catch (error) {
      this.logger.error(this.verifyRefreshToken.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }

  public async logout(req: any): Promise<any> {
    try {
      let user = <User>req.user;
      await this.authHelper.logout(user);

      return this.responseService.success(true, StringHelper.successResponse("auth", "logout"));
    } catch (error) {
      this.logger.error(this.logout.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
