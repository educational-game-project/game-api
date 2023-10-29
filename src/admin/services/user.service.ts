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
import { SearchDTO } from '@app/common/dto/search.dto';
import { dateToString } from '@app/common/pipeline/dateToString.pipeline';
import { ByIdDto } from '@app/common/dto/byId.dto';

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
      school.adminsCount = school.admins.length;
      school.save();

      return this.responseService.success(true, StringHelper.successResponse('user', 'add_admin'), admin);
    } catch (error) {
      this.logger.error(this.addAdmin.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }

  public async findAdmin(body: SearchDTO, req: Request): Promise<any> {
    try {
      const searchRegex = new RegExp(body.search?.toString(), 'i');
      const LIMIT_PAGE: number = body?.limit ?? 10;
      const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

      let searchOption: any = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phoneNumber: searchRegex },
          { 'school.name': searchRegex },
        ],
        role: UserRole.ADMIN,
        deletedAt: null
      };

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'schools',
            foreignField: '_id',
            localField: 'school',
            as: "school",
            pipeline: [
              ...dateToString,
              {
                $project: { admins: 0 }
              }
            ]
          }
        },
        ...dateToString,
        {
          $set: {
            school: { $ifNull: [{ $arrayElemAt: ['$school', 0] }, null] }
          }
        },
        {
          $match: searchOption
        },
        {
          $sort: { createdAt: -1 }
        }
      ];

      const admin = await this.usersModel.aggregate(pipeline)
        .skip(SKIP)
        .limit(LIMIT_PAGE);
      if (admin.length == 0) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('admin'));

      const total = await this.usersModel.aggregate(pipeline).count("total");

      return this.responseService.paging(StringHelper.successResponse('admin', 'list'), admin, {
        totalData: Number(total[0]?.total) ?? 0,
        perPage: LIMIT_PAGE,
        currentPage: body?.page ?? 1,
        totalPage: Math.ceil(total[0]?.total ?? 0 / LIMIT_PAGE),
      });
    } catch (error) {
      this.logger.error(this.findAdmin.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }

  public async deleteAdmin(body: ByIdDto, req: Request): Promise<any> {
    try {
      let admin = await this.usersModel.findOne({ _id: new Types.ObjectId(body.id), role: UserRole.ADMIN });
      if (!admin) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('admin'));

      admin.deletedAt = new Date();

      let school = await this.schoolsModel.findOne({ _id: admin.school });
      if (!school) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('school'));

      school.admins = school.admins.filter(i => i.toString() !== admin._id.toString());
      school.adminsCount--;
      school.save();

      return this.responseService.success(true, StringHelper.successResponse('admin', 'delete'));
    } catch (error) {
      this.logger.error(this.deleteAdmin.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }
}
