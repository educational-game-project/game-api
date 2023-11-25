import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { userSeeder } from '@app/common/seeders/user.seeder';
import { User } from '@app/common/model/schema/users.schema';
import { Model } from 'mongoose';
import { UserRole } from '@app/common/enums/role.enum';
import { AuthHelper } from '@app/common/helpers/auth.helper';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) { }

  async getHello(): Promise<any> {
    const superAdmin = await this.userModel.findOne({ role: UserRole.SUPER_ADMIN });
    if (!superAdmin) {
      const hashedPassword = this.authHelper.encodePassword('SuperAdmin123');
      const createUser = await this.userModel.create({ ...userSeeder[0], password: hashedPassword });
      if (!createUser) return `Failed Create Users`;
      return `${createUser.name} Successfully Created.`
    }

    return 'Welcome to Game API. Created by Iwan Suryaningrat.';
  }
}
