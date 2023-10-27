import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
    Model,
    PipelineStage,
    Types,
    isValidObjectId,
} from 'mongoose';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { Schools } from '@app/common/model/schema/schools.schema';

@Injectable()
export class SchoolAdminService {
    constructor(
        @InjectModel(Schools.name) private schoolsModel: Model<Schools>,
        @InjectModel(Users.name) private usersModel: Model<Users>,
        @Inject(ResponseService) private readonly responseService: ResponseService,
    ) { }

    private readonly logger = new Logger(SchoolAdminService.name);
}
