import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, {
  Model,
  PipelineStage,
  Types,
  isValidObjectId,
} from "mongoose";
import { LoginUserDto } from "@app/common/dto/auth.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  public async login(body: LoginUserDto): Promise<any> {
    try {
      let user = await this.userModel
        .findOne({ name: body.name, role: UserRole.USER })
        .populate("images");
      if (!user)
        return this.responseService.error(
          HttpStatus.NOT_FOUND,
          StringHelper.notFoundResponse("user"),
        );

      const tokens = await this.authHelper.generateTokens(user._id, {
        role: user.role,
      });

      return this.responseService.success(
        true,
        StringHelper.successResponse("user", "login"),
        { user, token: tokens },
      );
    } catch (error) {
      this.logger.error(this.login.name);
      console.log(error);
      this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        StringHelper.internalServerError,
        { value: error, constraint: "", property: "" },
      );
    }
  }
}
