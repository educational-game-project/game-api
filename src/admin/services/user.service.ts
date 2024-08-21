import { HttpStatus, Inject, Injectable, Logger, NotFoundException, HttpException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDTO, UpdateUserDTO } from "@app/common/dto/user.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { School } from "@app/common/model/schema/schools.schema";
import { UserRole } from "@app/common/enums/role.enum";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { ImageService } from "@app/common/helpers/file.helpers";
import { globalPopulate } from "@app/common/pipeline/global.populate";
import { userPipeline } from "@app/common/pipeline/user.pipeline";
import { LogService } from "./log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";
import { Log } from "@app/common/model/schema/log.schema";
import { Game } from "@app/common/model/schema/game.schema";

@Injectable()
export class UserAdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(Log.name) private logModel: Model<Log>,
    @InjectModel(Game.name) private gameModel: Model<Game>,

    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(ImageService) private imageHelper: ImageService,
    @Inject(LogService) private readonly logService: LogService,
  ) { }

  private readonly logger = new Logger(UserAdminService.name);

  public async addAdmin(body: CreateUserDTO, media: any, req: any,): Promise<any> {
    const users: User = <User>req.user;
    try {
      const password = body?.password ? this.authHelper.encodePassword(body.password) : this.authHelper.encodePassword("Admin1234");
      let school = await this.schoolModel.findOne({ _id: new Types.ObjectId(body?.schoolId) }).populate("images");
      if (!school) throw new NotFoundException("School Not Found");

      if (media?.length) media[0].isDefault = true;
      let admin = await this.userModel.create({
        name: body.name,
        email: body?.email ?? null,
        phoneNumber: body?.phoneNumber ?? null,
        role: UserRole.ADMIN,
        image: media?.length ? media[0] : null,
        password,
        school: school._id,
        addedBy: users._id,
      });

      school.admins.push(admin);
      school.adminsCount = school.admins.length;
      await school.save();

      admin.school = school;
      admin = admin.toObject();
      delete admin.password;
      delete admin.school.admins;

      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success add admin ${admin?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponseAdmin("User", "Add Admin"), admin,);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to add admin`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.addAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateAdmin(body: UpdateUserDTO, media: any, req: any,): Promise<any> {
    const users: User = <User>req.user;
    try {
      let admin = await this.userModel.findOne({ _id: new Types.ObjectId(body.id), role: UserRole.ADMIN }).populate('image');
      if (!admin) throw new NotFoundException("Admin Not Found");

      const check = await this.userModel.findOne({
        role: UserRole.USER,
        name: body.name,
        school: admin.school,
        _id: { $ne: admin._id },
      });
      if (check) throw new BadRequestException("Admin Name Already Exist");

      admin.$set(body)
      admin.lastUpdatedBy = users
      if (media.length) {
        if (admin?.image) await this.imageHelper.delete([admin.image])
        admin.image = media[0]
      }

      if (body?.schoolId && body?.schoolId !== admin.school.toString()) {
        let school = await this.schoolModel.findOne({ _id: new Types.ObjectId(body?.schoolId) });
        if (school) {
          let oldSchool = await this.schoolModel.findOne({ _id: admin.school });
          if (oldSchool) {
            oldSchool.admins = oldSchool.admins.filter(item => item.toString() !== admin._id.toString())
            oldSchool.adminsCount = oldSchool.admins.length
            await oldSchool.save();
          }

          admin.school = school
          school.admins.push(admin)
          school.adminsCount = school.admins.length
          await school.save()
        }
      }

      admin = await admin.save();

      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success edit admin ${admin?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponseAdmin("User", "Edit Admin"), admin,);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to edit admin`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.updateAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAdmin(body: SearchDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      const searchRegex = new RegExp(body.search?.toString(), "i");
      const LIMIT_PAGE: number = body?.limit ?? 10;
      const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

      let searchOption: any = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phoneNumber: searchRegex },
          { "school.name": searchRegex },
        ],
        role: UserRole.ADMIN,
        deletedAt: null,
      };

      if (body?.schoolId) searchOption.school = new Types.ObjectId(body?.schoolId);

      const admin = await this.userModel.aggregate(userPipeline(searchOption, SKIP, LIMIT_PAGE));
      const total = await this.userModel.aggregate(userPipeline(searchOption)).count("total");

      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success get admin list`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.paging(StringHelper.successResponseAdmin("Admin", "List"), admin, {
        totalData: Number(total[0]?.total) ?? 0,
        totalPage: Math.ceil((Number(total[0]?.total) ?? 0) / LIMIT_PAGE),
        currentPage: body?.page ?? 1,
        perPage: LIMIT_PAGE,
      },);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to get admin list`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.findAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteAdmin(body: ByIdDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let admin = await this.userModel.findOne({
        _id: new Types.ObjectId(body.id),
        role: UserRole.ADMIN,
      }).populate('image');
      if (!admin) throw new NotFoundException("Admin Not Found");

      if (admin.image) await this.imageHelper.delete([admin.image]);

      admin.image = null;
      admin.deletedAt = new Date();
      admin.deletedBy = users
      await admin.save();

      let school = await this.schoolModel.findOne({ _id: admin.school });
      if (!school) throw new NotFoundException("School Not Found");

      school.admins = school.admins.filter((i) => i.toString() !== admin._id.toString());
      school.adminsCount--;
      await school.save();

      await this.logService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} success delete admin ${admin?.name}`,
        success: true,
        summary: JSON.stringify(body),
      });

      await this.schoolModel.updateMany({ addedBy: admin._id }, { $set: { addedBy: null } });
      await this.schoolModel.updateMany({ deletedBy: admin._id }, { $set: { deletedBy: null } });
      await this.schoolModel.updateMany({ lastUpdatedBy: admin._id }, { $set: { lastUpdatedBy: null } });
      await this.logModel.updateMany({ actor: admin._id }, { $set: { deletedAt: new Date() } });
      await this.gameModel.updateMany({ addedBy: admin._id }, { $set: { addedBy: null } });
      await this.userModel.updateMany({ addedBy: admin._id }, { $set: { addedBy: null } });
      await this.userModel.updateMany({ deletedBy: admin._id }, { $set: { deletedBy: null } });
      await this.userModel.updateMany({ lastUpdatedBy: admin._id }, { $set: { lastUpdatedBy: null } });

      return this.responseService.success(true, StringHelper.successResponseAdmin("Admin", "Delete"));
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to delete admin`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.deleteAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async detailAdmin(body: ByIdDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let admin = await this.userModel.findOne({ _id: new Types.ObjectId(body.id), role: UserRole.ADMIN })
        .populate(globalPopulate(
          {
            school: true,
            user: false,
            addedBy: true,
            image: true,
            images: false,
            admins: false,
          }
        ))
      if (!admin) throw new NotFoundException("Admin Not Found");

      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success get detail admin ${admin?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponseAdmin("Admin", "Detail"), admin);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to get admin detail`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.detailAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserDetail(req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: new Types.ObjectId(users._id) })
        .populate(globalPopulate(
          {
            school: true,
            user: false,
            addedBy: true,
            image: true,
            images: false,
            admins: false,
          }
        ))

      if (!user) throw new NotFoundException("User Not Found");

      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success get detail user`,
        success: true,
      })

      return this.responseService.success(true, StringHelper.successResponseAdmin("User", "Get Student"), user)
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to get user detail`,
        success: false,
      })
      this.logger.error(this.getUserDetail.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getActiveUser(req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let activeAdmin = await this.userModel.count({ role: { $ne: UserRole.USER }, deletedAt: null, isActive: { $eq: true } })
      let activeUser = await this.userModel.count({ role: UserRole.USER, deletedAt: null, isActive: { $eq: true } })

      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success get active users`,
        success: true,
      })

      return this.responseService.success(true, StringHelper.successResponseAdmin("User", "Get Active User"), { activeAdmin, activeUser })
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to get active users`,
        success: false,
      })
      this.logger.error(this.getActiveUser.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
