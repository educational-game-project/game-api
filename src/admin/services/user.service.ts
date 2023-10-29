import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from 'mongoose';
import { AddAdminDTO, CreateUserDto, UpdateUserDto } from '@app/common/dto/user.dto';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Schools } from '@app/common/model/schema/schools.schema';
import { UserRole } from '@app/common/enums/role.enum';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Schools.name) private schoolsModel: Model<Schools>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) { }

  private HASH_BCRYPT = this.configService.get<number>('HASH_BCRYPT');

  private readonly logger = new Logger(UserAdminService.name);

  public async addAdmin(body: AddAdminDTO, media: any, req: Request): Promise<any> {
    try {
      const password = body?.password ? await bcrypt.hash(body?.password, Number(this.HASH_BCRYPT)) : await bcrypt.hash('Admin123', Number(this.HASH_BCRYPT));

      let school = await this.schoolsModel.findOne({ _id: new Types.ObjectId(body?.schoolId) });
      if (!school) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('school'));

      media[0].isDefault = true;
      let admin = await this.usersModel.create({
        name: body.name,
        email: body?.email ?? null,
        phoneNumber: body?.phoneNumber,
        role: UserRole.ADMIN,
        images: media?.length ? media : null,
        password,
        school: school._id
      });

      school.admins.push(admin);
      school.save();

      return this.responseService.success(true, StringHelper.successResponse('user', 'add_admin'), admin);
    } catch (error) {
      this.logger.error(this.addAdmin.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }
}
