import { HttpStatus, Inject, Injectable, Logger, NotFoundException, HttpException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { School } from "@app/common/model/schema/schools.schema";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { CreateSchoolDTO, EditSchoolDTO } from "@app/common/dto/school.dto";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { Image } from "@app/common/model/schema/subtype/images.subtype";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { globalPopulate } from "@app/common/pipeline/global.populate";
import { schoolPipeline } from "@app/common/pipeline/school.pipeline";
import { LogsService } from "./log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class SchoolAdminService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ImagesService) private imageService: ImagesService,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(SchoolAdminService.name);

  public async create(body: CreateSchoolDTO, media: Array<Image>, req: any,): Promise<any> {
    const users: User = <User>req.user;
    try {
      const { name, address } = body;

      const exist = await this.schoolModel.count({ name, address });
      if (exist > 0) throw new BadRequestException("School Already Exist");

      const school = await this.schoolModel.create({
        name,
        address,
        images: media ?? [],
        addedBy: users._id,
      });

      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} success add school ${school?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("schoool", "create"), school);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} failed to add school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.create.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async edit(body: EditSchoolDTO, media: any, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      const { id, name, address, mediaIds } = body;

      let school = await this.schoolModel.findOne({ _id: new Types.ObjectId(id) });
      if (!school) throw new NotFoundException("School Not Found");

      if (name) school.name = name;
      if (address) school.address = address;

      if (mediaIds) {
        let deletedImages = school?.images.filter((ev) => !mediaIds?.includes(ev._id?.toString()));
        if (deletedImages.length) await this.imageService.delete(deletedImages)

        school.images = school?.images.filter((ev) => mediaIds?.includes(ev._id?.toString()));
      }

      if (media?.length) school.images.push(...media);
      school?.images?.map((item, index) => index === 0 ? (item.isDefault = true) : (item.isDefault = false));
      school.lastUpdatedBy = users

      school = await school.save();

      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} success edit school ${school?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("schoool", "edit"), school);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} failed to edit school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.edit.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async find(body: SearchDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      const searchRegex = new RegExp(body.search?.toString(), "i");
      const LIMIT_PAGE: number = body?.limit ?? 10;
      const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

      let searchOption: any = {
        $or: [{ name: searchRegex }, { address: searchRegex }],
        deletedAt: null,
      };

      const schools = await this.schoolModel.aggregate(schoolPipeline(searchOption, SKIP, LIMIT_PAGE));
      const total = await this.schoolModel.aggregate(schoolPipeline(searchOption)).count("total");

      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} success get school list`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.paging(StringHelper.successResponse("schoool", "list"),
        schools,
        {
          totalData: Number(total[0]?.total) ?? 0,
          perPage: LIMIT_PAGE,
          currentPage: body?.page ?? 1,
          totalPage: Math.ceil((Number(total[0]?.total) ?? 0) / LIMIT_PAGE),
        },
      );
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} failed to get school list`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.find.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async detail(body: ByIdDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      const school = await this.schoolModel.findOne({ _id: new Types.ObjectId(body.id) })
        .populate(globalPopulate(
          {
            school: false,
            user: false,
            addedBy: false,
            image: false,
            images: true,
            admins: true,
          }
        ))
      if (!school) throw new NotFoundException("School Not Found");

      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} success get detail school ${school?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("school", "get_detail"), school);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${users?.name} failed to get school detail`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.detail.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async delete(body: ByIdDTO, req: any): Promise<any> {
    const user: User = <User>req.user;
    try {
      let school = await this.schoolModel.findOne({
        _id: new Types.ObjectId(body.id)
      }).populate('images');
      if (!school) throw new NotFoundException("School Not Found");

      if (school?.images?.length) await this.imageService.delete(school.images);

      school.images = [];
      school.deletedBy = user
      school.deletedAt = new Date();
      await school.save();

      let users = await this.userModel.find({ school: school._id });

      if (users.length > 0) users.forEach(async (item) => {
        item.school = null;
        await item.save();
      });

      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${user?.name} success delete school ${school?.name}`,
        success: true,
        summary: JSON.stringify(body),
      })

      return this.responseService.success(true, StringHelper.successResponse("school", "delete"));
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${user?.name} failed to delete school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.delete.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
