import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from 'mongoose';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { Schools } from '@app/common/model/schema/schools.schema';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { CreateSchoolDTO, EditSchoolDTO } from '@app/common/dto/school.dto';
import { SearchDTO } from '@app/common/dto/search.dto';
import { dateToString } from '@app/common/pipeline/dateToString.pipeline';
import { ByIdDto } from '@app/common/dto/byId.dto';

@Injectable()
export class SchoolAdminService {
    constructor(
        @InjectModel(Schools.name) private schoolsModel: Model<Schools>,
        @InjectModel(Users.name) private usersModel: Model<Users>,
        @Inject(ResponseService) private readonly responseService: ResponseService,
    ) { }

    private readonly logger = new Logger(SchoolAdminService.name);

    public async create(body: CreateSchoolDTO, media: any, req: Request): Promise<any> {
        try {
            const { name, address } = body;

            const exist = await this.schoolsModel.count({ name });
            if (exist > 0) return this.responseService.error(HttpStatus.CONFLICT, StringHelper.existResponse('school'));

            if (media) media.isDefault = true;
            const school = await this.schoolsModel.create({
                name,
                address,
                images: media
            });

            return this.responseService.success(true, StringHelper.successResponse('schoool', 'create'), school);
        } catch (error) {
            this.logger.error(this.create.name);
            console.log(error);
            return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
        }
    }

    public async edit(body: EditSchoolDTO, media: any, req: Request): Promise<any> {
        try {
            const { id, name, address } = body;

            let school = await this.schoolsModel.findOne({ _id: new Types.ObjectId(id) });
            if (!school) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('school'));

            if (name) school.name = name;
            if (address) school.address = address;

            if (body.mediaIds) school.images = school?.images.filter(ev => body.mediaIds?.includes(ev._id?.toString()));

            if (media?.length > 0) school.images.push(...media);
            school?.images?.map((item, index) => index === 0 ? item.isDefault = true : item.isDefault = false);

            school = await school.save();

            return this.responseService.success(true, StringHelper.successResponse('schoool', 'edit'), school);
        } catch (error) {
            this.logger.error(this.edit.name);
            console.log(error);
            return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
        }
    }

    public async find(body: SearchDTO, req: Request): Promise<any> {
        try {
            const searchRegex = new RegExp(body.search?.toString(), 'i');
            const LIMIT_PAGE: number = body?.limit ?? 10;
            const SKIP: number = (Number(body?.page ?? 1) - 1) * LIMIT_PAGE;

            let searchOption: any = {
                $or: [
                    { name: searchRegex },
                    { address: searchRegex },
                ],
                deletedAt: null
            }

            const pipeline: PipelineStage[] = [
                {
                    $lookup: {
                        from: 'users',
                        foreignField: "_id",
                        localField: "admins",
                        as: "admins",
                        pipeline: [
                            {
                                $match: { deletedAt: null }
                            },
                            {
                                $project: { school: 0 }
                            }
                        ]
                    }
                },
                ...dateToString,
                {
                    $match: searchOption
                },
                {
                    $sort: { createdAt: -1 }
                }
            ];

            const schools = await this.schoolsModel.aggregate(pipeline).skip(SKIP).limit(LIMIT_PAGE);
            if (schools.length == 0) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('school'));

            const total = await this.schoolsModel.aggregate(pipeline).count('total');

            return this.responseService.paging(StringHelper.successResponse('schoool', 'list'), schools, {
                totalData: Number(total[0]?.total) ?? 0,
                perPage: LIMIT_PAGE,
                currentPage: body?.page ?? 1,
                totalPage: Math.ceil(total[0]?.total ?? 0 / LIMIT_PAGE),
            });
        } catch (error) {
            this.logger.error(this.find.name);
            console.log(error);
            return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
        }
    }

    public async detail(body: ByIdDto, req: Request): Promise<any> {
        try {
            const school = await this.schoolsModel.findOne({ _id: new Types.ObjectId(body.id) })
                .populate({
                    path: "admins",
                    select: "name role images email phoneNumber",
                    options: {
                        match: { deletedAt: null }
                    }
                });
            if (!school) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('school'));

            return this.responseService.success(true, StringHelper.successResponse('school', 'get_detail'), school);
        } catch (error) {
            this.logger.error(this.detail.name);
            console.log(error);
            return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
        }
    }

    public async delete(body: ByIdDto, req: Request): Promise<any> {
        try {
            let school = await this.schoolsModel.findOne({ _id: new Types.ObjectId(body.id) });
            if (!school) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('school'));

            // Validate Super Admin

            school.deletedAt = new Date()
            school.save();

            let users = await this.usersModel.find({ school: school._id });

            if (users.length > 0) users.forEach(async (item) => {
                item.school = null;
                await item.save();
            })

            return this.responseService.success(true, StringHelper.successResponse('school', 'delete'));
        } catch (error) {
            this.logger.error(this.delete.name);
            console.log(error);
            return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
        }
    }
}
