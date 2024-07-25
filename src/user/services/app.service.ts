import { Injectable, Inject, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { userSeeder } from "@app/common/seeders/user.seeder";
import { User } from "@app/common/model/schema/users.schema";
import { Model } from "mongoose";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  async getHello(): Promise<any> {
    try {
      const superAdmin = await this.userModel.findOne({
        role: UserRole.SUPER_ADMIN,
      });

      if (!superAdmin) {
        const hashedPassword = this.authHelper.encodePassword("SuperAdmin123");
        const createUser = await this.userModel.create({
          ...userSeeder[0],
          password: hashedPassword,
        });
        if (!createUser) return { message: `Failed Create Users` };
      }

      const Admin = await this.userModel.findOne({
        role: UserRole.ADMIN,
      });

      if (!Admin) {
        const hashedPassword = this.authHelper.encodePassword("Admin123");
        const createUser = await this.userModel.create({
          ...userSeeder[1],
          password: hashedPassword,
        });
        if (!createUser) return { message: `Failed Create Users` };
      }

      return this.responseService.success(true, "Welcome to Game API. Created by Iwan Suryaningrat.")
    } catch (error) {
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
