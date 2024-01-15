import { HttpStatus, Inject, Injectable, Logger, NotFoundException, HttpException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { CreateUserDto, UpdateUserDto } from "@app/common/dto/user.dto";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { School } from "@app/common/model/schema/schools.schema";
import { UserRole } from "@app/common/enums/role.enum";
import { SearchDTO } from "@app/common/dto/search.dto";
import { dateToString } from "@app/common/pipeline/dateToString.pipeline";
import { ByIdDto } from "@app/common/dto/byId.dto";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { ImagesService } from "@app/common/helpers/file.helpers";

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(ImagesService) private imageHelper: ImagesService,
  ) { }

  private readonly logger = new Logger(StudentsService.name);

  public async addStudent(body: CreateUserDto, media: any, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: users._id })
      if (!user) throw new NotFoundException("User Not Found");

      let school = await this.schoolModel.findOne({ _id: new Types.ObjectId(body?.schoolId) });
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

      return this.responseService.success(true, StringHelper.successResponse("user", "add_student"), student);
    } catch (error) {
      this.logger.error(this.addStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async editStudent(body: UpdateUserDto, media: any, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let user = await this.userModel.findOne({ _id: new Types.ObjectId(body?.id), role: UserRole.USER }).populate('image')
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

      return this.responseService.success(true, StringHelper.successResponse("user", "edit_student"), user);
    } catch (error) {
      this.logger.error(this.editStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async listStudents(body: SearchDTO, req: any): Promise<any> {
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

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "school",
            foreignField: "_id",
            localField: "school",
            as: "school",
            pipeline: [
              ...dateToString,
              {
                $project: { admins: 0 },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "addedBy",
            foreignField: "_id",
            as: "addedBy",
            pipeline: [
              {
                $lookup: {
                  from: "images",
                  localField: "image",
                  foreignField: "_id",
                  as: "image",
                },
              },
              {
                $set: {
                  image: { $ifNull: [{ $arrayElemAt: ["$image", 0] }, null] },
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            as: "image",
          },
        },
        ...dateToString,
        {
          $set: {
            school: { $ifNull: [{ $arrayElemAt: ["$school", 0] }, null] },
            addedBy: { $ifNull: [{ $arrayElemAt: ["$addedBy", 0] }, null] },
            image: { $ifNull: [{ $arrayElemAt: ["$image", 0] }, null] },
          },
        },
        {
          $match: searchOption,
        },
        {
          $sort: { createdAt: -1 },
        },
      ];

      const students = await this.userModel.aggregate(pipeline).skip(SKIP).limit(LIMIT_PAGE);

      const total = await this.userModel.aggregate(pipeline).count("total");

      return this.responseService.paging(
        StringHelper.successResponse("student", "list"),
        students,
        {
          totalData: Number(total[0]?.total) ?? 0,
          perPage: LIMIT_PAGE,
          currentPage: body?.page ?? 1,
          totalPage: Math.ceil(total[0]?.total ?? 0 / LIMIT_PAGE),
        },
      );
    } catch (error) {
      this.logger.error(this.addStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteStudent(body: ByIdDto, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      let student = await this.userModel.findOne({
        _id: new Types.ObjectId(body.id),
        role: UserRole.USER,
      }).populate('image');
      if (!student) throw new NotFoundException("Student Not Found");

      if (student.image) await this.imageHelper.delete([student.image]);

      student.image = null;
      student.deletedAt = new Date();
      student.deletedBy = users
      await student.save();

      let school = await this.schoolModel.findOne({ _id: student.school });
      if (!school) throw new NotFoundException("School Not Found");

      school.studentsCount--;
      await school.save();

      return this.responseService.success(true, StringHelper.successResponse("student", "delete"));
    } catch (error) {
      this.logger.error(this.deleteStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}