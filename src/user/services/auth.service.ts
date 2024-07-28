import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginUserDTO, ReauthDTO } from "@app/common/dto/auth.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { globalPopulate } from "@app/common/pipeline/global.populate";
import { LogService } from "src/admin/services/log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(LogService) private readonly logService: LogService,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  public async login(body: LoginUserDTO): Promise<any> {
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

      await this.logService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user.name} login into game`,
        success: true,
        summary: JSON.stringify(body),
        actor: user._id.toString(),
      })

      return this.responseService.success(true, StringHelper.successResponse("user", "login"), { user, tokens });
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.AUTH,
        description: `${body.name} failed login into game`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.login.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }

  public async verifyRefreshToken(body: ReauthDTO, req: any): Promise<any> {
    let { refreshToken } = body;
    let { isValid, user } = await this.authHelper.validate(refreshToken);

    try {
      if (!user) user = await this.userModel.findOne({ refreshToken }).populate(globalPopulate({
        school: true,
        user: false,
        addedBy: false,
        image: true,
        images: false,
        admins: false,
      }));

      if (user) {
        user = user.toObject();
        delete user.password;

        const tokens = await this.authHelper.generateTokens(user._id, { name: user.name, role: user.role });
        await this.userModel.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

        await this.logService.logging({
          target: TargetLogEnum.AUTH,
          description: `${user.name} reverify refresh token`,
          success: true,
          summary: JSON.stringify(body),
          actor: user._id.toString(),
        })

        return this.responseService.success(true, StringHelper.successResponse("auth", "verifyRefreshToken"), { user, tokens });
      }
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user?.name} failed reverify refresh token`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.verifyRefreshToken.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }

  public async logout(req: any): Promise<any> {
    let user = <User>req.user;
    try {
      await this.logService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user?.name} logout successfully.`,
        success: true,
      })

      await this.authHelper.logout(user);

      return this.responseService.success(true, StringHelper.successResponse("auth", "logout"));
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.AUTH,
        description: `${user?.name} failed to logout`,
        success: false,
        summary: error?.message
      })
      this.logger.error(this.logout.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
