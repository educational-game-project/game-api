import { HttpStatus, Inject, Injectable, Logger, InternalServerErrorException, NotFoundException, HttpException, BadRequestException, } from "@nestjs/common";
import { Request } from "express";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { School } from "@app/common/model/schema/schools.schema";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { CreateSchoolDTO, EditSchoolDTO } from "@app/common/dto/school.dto";
import { SearchDTO } from "@app/common/dto/search.dto";
import { dateToString } from "@app/common/pipeline/dateToString.pipeline";
import { ByIdDto } from "@app/common/dto/byId.dto";
import { Image } from "@app/common/model/schema/subtype/images.subtype";
import { ImagesService } from "@app/common/helpers/file.helpers";

@Injectable()
export class SchoolAdminService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ImagesService) private imageService: ImagesService,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(SchoolAdminService.name);

  public async create(
    body: CreateSchoolDTO,
    media: Array<Image>,
    req: Request,
  ): Promise<any> {
    try {
      const { name, address } = body;

      const exist = await this.schoolModel.count({ name });
      if (exist > 0) throw new BadRequestException("School Already Exist");

      const school = await this.schoolModel.create({
        name,
        address,
        images: media ?? [],
      });

      return this.responseService.success(
        true,
        StringHelper.successResponse("schoool", "create"),
        school,
      );
    } catch (error) {
      this.logger.error(this.create.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async edit(
    body: EditSchoolDTO,
    media: any,
    req: Request,
  ): Promise<any> {
    try {
      const { id, name, address } = body;

      let school = await this.schoolModel.findOne({
        _id: new Types.ObjectId(id),
      });
      if (!school) throw new NotFoundException("School Not Found");

      if (name) school.name = name;
      if (address) school.address = address;

      if (body.mediaIds)
        school.images = school?.images.filter((ev) =>
          body.mediaIds?.includes(ev._id?.toString()),
        );

      if (media?.length > 0) school.images.push(...media);
      school?.images?.map((item, index) =>
        index === 0 ? (item.isDefault = true) : (item.isDefault = false),
      );

      school = await school.save();

      return this.responseService.success(
        true,
        StringHelper.successResponse("schoool", "edit"),
        school,
      );
    } catch (error) {
      this.logger.error(this.edit.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async find(body: SearchDTO, req: Request): Promise<any> {
    try {
      const searchRegex = new RegExp(body.search?.toString(), "i");
      const LIMIT_PAGE: number = body?.limit ?? 10;
      const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

      let searchOption: any = {
        $or: [{ name: searchRegex }, { address: searchRegex }],
        deletedAt: null,
      };

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "admins",
            as: "admins",
            pipeline: [
              {
                $match: { deletedAt: null },
              },
              {
                $project: { school: 0 },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        ...dateToString,
        {
          $match: searchOption,
        },
        {
          $sort: { createdAt: -1 },
        },
      ];

      const schools = await this.schoolModel
        .aggregate(pipeline)
        .skip(SKIP)
        .limit(LIMIT_PAGE);

      const total = await this.schoolModel.aggregate(pipeline).count("total");

      return this.responseService.paging(
        StringHelper.successResponse("schoool", "list"),
        schools,
        {
          totalData: Number(total[0]?.total) ?? 0,
          perPage: LIMIT_PAGE,
          currentPage: body?.page ?? 1,
          totalPage: Math.ceil(total[0]?.total ?? 0 / LIMIT_PAGE),
        },
      );
    } catch (error) {
      this.logger.error(this.find.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async detail(body: ByIdDto, req: Request): Promise<any> {
    try {
      const school = await this.schoolModel
        .findOne({ _id: new Types.ObjectId(body.id) })
        .populate({
          path: "admins",
          select: "name role images email phoneNumber",
          options: {
            match: { deletedAt: null },
          },
        })
        .populate("images");
      if (!school) throw new NotFoundException("School Not Found");

      return this.responseService.success(
        true,
        StringHelper.successResponse("school", "get_detail"),
        school,
      );
    } catch (error) {
      this.logger.error(this.detail.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async delete(body: ByIdDto, req: Request): Promise<any> {
    try {
      let school = await this.schoolModel.findOne({
        _id: new Types.ObjectId(body.id),
      });
      if (!school) throw new NotFoundException("School Not Found");

      await this.imageService.delete(school.images);

      school.deletedAt = new Date();
      school.save();

      let users = await this.userModel.find({ school: school._id });

      if (users.length > 0)
        users.forEach(async (item) => {
          item.school = null;
          await item.save();
        });

      return this.responseService.success(
        true,
        StringHelper.successResponse("school", "delete"),
      );
    } catch (error) {
      this.logger.error(this.delete.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
