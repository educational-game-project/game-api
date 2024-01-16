import { HttpStatus, Inject, Injectable, Logger, NotFoundException, HttpException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDto, UpdateUserDto } from "@app/common/dto/user.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { School } from "@app/common/model/schema/schools.schema";
import { UserRole } from "@app/common/enums/role.enum";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDto } from "@app/common/dto/byId.dto";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { globalPopulate } from "@app/common/pipeline/global.populate";
import { userPipeline } from "@app/common/pipeline/user.pipeline";

@Injectable()
export class UserAdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(ImagesService) private imageHelper: ImagesService,
  ) { }

  private readonly logger = new Logger(UserAdminService.name);

  //////////////////////////////////////////// ADMIN //////////////////////////////////////////////

  public async addAdmin(body: CreateUserDto, media: any, req: any,): Promise<any> {
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
      delete admin.school.admins

      return this.responseService.success(true, StringHelper.successResponse("user", "add_admin"), admin,);
    } catch (error) {
      this.logger.error(this.addAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateAdmin(body: UpdateUserDto, media: any, req: any,): Promise<any> {
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
        if (admin.image) await this.imageHelper.delete([admin.image])
        admin.image = media[0]
      }

      if (body?.schoolId && body?.schoolId !== admin.school.toString()) {
        let school = await this.schoolModel.findOne({ _id: new Types.ObjectId(body?.schoolId) });
        if (school) {
          admin.school = school
          school.admins.push(admin)
          school.adminsCount = school.admins.length
          await school.save()
        }
      }

      admin = await admin.save();

      return this.responseService.success(true, StringHelper.successResponse("user", "edit_admin"), admin,);
    } catch (error) {
      this.logger.error(this.updateAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findAdmin(body: SearchDTO, req: any): Promise<any> {
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

      const admin = await this.userModel.aggregate(userPipeline(searchOption)).skip(SKIP).limit(LIMIT_PAGE);

      const total = await this.userModel.aggregate(userPipeline(searchOption)).count("total");

      return this.responseService.paging(StringHelper.successResponse("admin", "list"), admin, {
        totalData: Number(total[0]?.total) ?? 0,
        totalPage: Math.ceil(total[0]?.total ?? 0 / LIMIT_PAGE),
        currentPage: body?.page ?? 1,
        perPage: LIMIT_PAGE,
      },);
    } catch (error) {
      this.logger.error(this.findAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteAdmin(body: ByIdDto, req: any): Promise<any> {
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

      return this.responseService.success(true, StringHelper.successResponse("admin", "delete"));
    } catch (error) {
      this.logger.error(this.deleteAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async detailAdmin(body: ByIdDto, req: any): Promise<any> {
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

      return this.responseService.success(true, StringHelper.successResponse("admin", "detail"), admin);
    } catch (error) {
      this.logger.error(this.detailAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserDetail(req: any): Promise<any> {
    try {
      let user = await this.userModel.findOne({ _id: new Types.ObjectId(req.user._id) })
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

      if (!user) throw new NotFoundException("User Not Found")

      return this.responseService.success(true, StringHelper.successResponse("user", "get_Student"), user)
    } catch (error) {
      this.logger.error(this.getUserDetail.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
