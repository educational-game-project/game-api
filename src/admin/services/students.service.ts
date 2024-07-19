import { HttpStatus, Inject, Injectable, Logger, NotFoundException, HttpException, BadRequestException, MethodNotAllowedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDTO, UpdateUserDTO } from "@app/common/dto/user.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { School } from "@app/common/model/schema/schools.schema";
import { UserRole } from "@app/common/enums/role.enum";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDto } from "@app/common/dto/byId.dto";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { globalPopulate } from "@app/common/pipeline/global.populate";
import { userPipeline } from "@app/common/pipeline/user.pipeline";
import { LogsService } from "./log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(ImagesService) private imageHelper: ImagesService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(StudentsService.name);

  public async addStudent(body: CreateUserDTO, media: any, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id })
      if (!user) throw new NotFoundException("User Not Found");

      let school = await this.schoolModel.findOne({ _id: body?.schoolId ? new Types.ObjectId(body?.schoolId) : user?.school });
      if (!school) throw new NotFoundException("School Not Found");

      const check = await this.userModel.findOne({
        role: UserRole.USER,
        name: body.name,
        school: school._id,
      });
      if (check) throw new BadRequestException("Student Already Exist");

      let student = await this.userModel.create({
        name: body.name,
        email: body?.email ?? null,
        phoneNumber: body?.phoneNumber ?? null,
        role: UserRole.USER,
        image: media?.length ? media[0] : null,
        password: null,
        school: school._id,
        addedBy: user._id
      });

      school.studentsCount++;
      school.save();

      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} success add student ${student?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("user", "add_student"), student);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} failed to add student`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.addStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async editStudent(body: UpdateUserDTO, media: any, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let query: any = {
        _id: new Types.ObjectId(body?.id),
        role: UserRole.USER,
        deletedAt: null
      }
      if (users.role === UserRole.ADMIN && users?.school) query.school = users?.school;

      let user = await this.userModel.findOne().populate('image')
      if (!user) throw new NotFoundException("User Not Found");

      const check = await this.userModel.findOne({
        role: UserRole.USER,
        name: body.name,
        school: user.school,
        _id: { $ne: user._id },
      });
      if (check) throw new BadRequestException("Student Name Already Exist");

      user.$set(body)
      user.lastUpdatedBy = users
      if (media.length) {
        if (user.image) await this.imageHelper.delete([user.image])
        user.image = media[0]
      }
      await user.save();

      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} success edit student ${user?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("user", "edit_student"), user);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} failed to edit student`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.editStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async listStudents(body: SearchDTO, req: any): Promise<any> {
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
        role: UserRole.USER,
        deletedAt: null,
      };

      if (users?.school) searchOption.school = users?.school;

      const students = await this.userModel.aggregate(userPipeline(searchOption, SKIP, LIMIT_PAGE));
      const total = await this.userModel.aggregate(userPipeline(searchOption)).count("total");

      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} success get student list`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.paging(
        StringHelper.successResponse("student", "list"),
        students,
        {
          totalData: Number(total[0]?.total) ?? 0,
          perPage: LIMIT_PAGE,
          currentPage: body?.page ?? 1,
          totalPage: Math.ceil((Number(total[0]?.total) ?? 0) / LIMIT_PAGE),
        },
      );
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} failed to get student list`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.addStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteStudent(body: ByIdDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let student = await this.userModel.findOne({ _id: new Types.ObjectId(body.id), role: UserRole.USER }).populate('image');
      if (!student) throw new NotFoundException("Student Not Found");
      if (users.role == UserRole.ADMIN && users.school.toString() !== student.school.toString()) throw new MethodNotAllowedException("You Can't Delete Student From Other School");

      if (student.image) await this.imageHelper.delete([student.image]);

      student.image = null;
      student.deletedAt = new Date();
      student.deletedBy = users
      await student.save();

      let school = await this.schoolModel.findOne({ _id: student.school });
      if (!school) throw new NotFoundException("School Not Found");

      school.studentsCount--;
      await school.save();

      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} success delete student ${student?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("student", "delete"));
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${users?.name} failed to student admin`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.deleteStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async detailStudent(body: ByIdDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let student = await this.userModel.findOne({ _id: new Types.ObjectId(body.id), role: UserRole.USER })
        .populate(globalPopulate({
          school: true,
          user: false,
          addedBy: true,
          image: true,
          images: false,
          admins: false,
        }))
      if (!student) throw new NotFoundException("Student Not Found");

      await this.logsService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success get detail student ${student?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("student", "detail"), student)
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to get student detail`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.deleteStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getActiveStudent(req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let activeAdmin = await this.userModel.count({ role: { $ne: UserRole.USER }, deletedAt: null, isActive: { $eq: true }, school: users?.school });
      let activeUser = await this.userModel.count({ role: UserRole.USER, deletedAt: null, isActive: { $eq: true }, school: users?.school });

      await this.logsService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} success get active users`,
        success: true,
      })

      return this.responseService.success(true, StringHelper.successResponse("user", "get_active_user"), { activeAdmin, activeUser })
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${users?.name} failed to get active users`,
        success: false,
      })
      this.logger.error(this.getActiveStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
