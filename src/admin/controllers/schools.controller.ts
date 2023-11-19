import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { SchoolAdminService } from '../services/schools.service';
import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, InternalServerErrorException, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { fileStorage, imageFilter, limitImageUpload } from '@app/common/utils/validators/file.validator';
import { diskStorage } from 'multer';
import { ImagesService } from '@app/common/helpers/file.helpers';
import { CreateSchoolDTO, EditSchoolDTO } from '@app/common/dto/school.dto';
import { ResponseService } from '@app/common/response/response.service';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { SearchDTO } from '@app/common/dto/search.dto';
import { ByIdDto } from '@app/common/dto/byId.dto';
import { AuthenticationGuard } from '@app/common/auth/authentication.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { AuthorizationGuard } from '@app/common/auth/authorization.guard';
import { UserRole } from '@app/common/enums/role.enum';

@Roles([UserRole.SUPER_ADMIN])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('admin/schools')
export class SchoolAdminController {
    constructor(
        private schoolService: SchoolAdminService,
        @Inject(ImagesService) private imageService: ImagesService,
        @Inject(ResponseService) private readonly responseService: ResponseService,
    ) { }

    private readonly logger = new Logger(SchoolAdminService.name);

    @Post()
    @UseInterceptors(FileInterceptor('media', { fileFilter: imageFilter, limits: limitImageUpload(), storage: diskStorage(fileStorage()) }))
    async create(@Body() body: CreateSchoolDTO, @UploadedFile() media: Express.Multer.File, @Req() req: Request): Promise<any> {
        try {
            const files = media ? await this.imageService.define([media]) : [];

            return this.schoolService.create(body, files, req);
        } catch (error) {
            this.logger.error(this.create.name);
            console.log(error);
            throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @UseInterceptors(AnyFilesInterceptor({ fileFilter: imageFilter, limits: limitImageUpload(), storage: diskStorage(fileStorage()) }))
    async edit(@Body() body: EditSchoolDTO, @UploadedFiles() media: Array<Express.Multer.File>, @Req() req: Request): Promise<any> {
        try {
            const files = media?.length ? await this.imageService.define(media) : [];

            return this.schoolService.edit(body, files, req);
        } catch (error) {
            this.logger.error(this.edit.name);
            console.log(error);
            throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('find')
    async find(@Body() body: SearchDTO, @Req() req: Request): Promise<any> {
        return this.schoolService.find(body, req);
    }

    @Post('detail')
    async detail(@Body() body: ByIdDto, @Req() req: Request): Promise<any> {
        return this.schoolService.detail(body, req);
    }

    @Delete()
    async delete(@Body() body: ByIdDto, @Req() req: Request): Promise<any> {
        return this.schoolService.delete(body, req);
    }
}
