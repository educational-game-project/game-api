import { HttpStatus, Inject, Injectable, Logger, NotFoundException, HttpException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types, } from 'mongoose';
import { CreateUserDto, } from '@app/common/dto/user.dto';
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
import { AuthHelper } from '@app/common/helpers/auth.helper';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Schools.name) private schoolsModel: Model<Schools>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) { }

  private HASH_BCRYPT = this.configService.get<number>('HASH_BCRYPT');

  private readonly logger = new Logger(UserAdminService.name);

  public async addAdmin(body: CreateUserDto, media: any, req: Request): Promise<any> {
    try {
      const password = body?.password ? this.authHelper.encodePassword(body.password) : this.authHelper.encodePassword('Admin1234');

      let school = await this.schoolsModel.findOne({ _id: new Types.ObjectId(body?.schoolId) });
      if (!school) throw new NotFoundException("School Not Found");

      if (media?.length) media[0].isDefault = true;
      let admin = await this.usersModel.create({
        name: body.name,
        email: body?.email ?? null,
        phoneNumber: body?.phoneNumber ?? null,
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
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteAdmin(body: ByIdDto, req: Request): Promise<any> {
    try {
      let admin = await this.usersModel.findOne({ _id: new Types.ObjectId(body.id), role: UserRole.ADMIN });
      if (!admin) throw new NotFoundException("Admin Not Found");

      admin.deletedAt = new Date();

      let school = await this.schoolsModel.findOne({ _id: admin.school });
      if (!school) throw new NotFoundException("School Not Found");

      school.admins = school.admins.filter(i => i.toString() !== admin._id.toString());
      school.adminsCount--;
      school.save();

      return this.responseService.success(true, StringHelper.successResponse('admin', 'delete'));
    } catch (error) {
      this.logger.error(this.deleteAdmin.name);
      console.log(error);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async addStudent(body: CreateUserDto, media: any, req: Request): Promise<any> {
    try {
      let school = await this.schoolsModel.findOne({ _id: new Types.ObjectId(body?.schoolId) });
      if (!school) throw new NotFoundException("School Not Found");

      const check = await this.usersModel.findOne({ role: UserRole.USER, name: body.name, school: school._id })
      if (check) throw new BadRequestException("Student Already Exist")

      let student = await this.usersModel.create({
        name: body.name,
        email: body?.email ?? null,
        phoneNumber: body?.phoneNumber ?? null,
        role: UserRole.USER,
        images: media?.length ? media : null,
        password: null,
        school: school._id
      });

      school.studentsCount++;
      school.save();

      return this.responseService.success(true, StringHelper.successResponse('user', 'add_admin'), student);
    } catch (error) {
      this.logger.error(this.addStudent.name);
      console.log(error);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
