import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId, } from 'mongoose';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { Schools } from '@app/common/model/schema/schools.schema';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { CreateSchoolDTO, EditSchoolDTO } from '@app/common/dto/school.dto';

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

            media.isDefault = true;
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
            school.images.map((item, index) => index === 0 ? item.isDefault = true : item.isDefault = false);

            school = await school.save();

            return this.responseService.success(true, StringHelper.successResponse('schoool', 'edit'), school);
        } catch (error) {
            this.logger.error(this.edit.name);
            console.log(error);
            return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
        }
    }
}
