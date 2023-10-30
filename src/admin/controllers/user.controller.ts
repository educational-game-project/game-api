import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { fileStorage, imageFilter, limitImageUpload } from '@app/common/utils/validators/file.validator';
import { diskStorage } from 'multer';
import { ImagesService } from '@app/common/helpers/file.helpers';
import { ResponseService } from '@app/common/response/response.service';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { SearchDTO } from '@app/common/dto/search.dto';
import { ByIdDto } from '@app/common/dto/byId.dto';
import { UserAdminService } from '../services/user.service';
import { CreateUserDto, } from '@app/common/dto/user.dto';

@Controller('admin/user')
export class UserAdminController {
  constructor(
    private readonly userService: UserAdminService,
    @Inject(ImagesService) private imageHelper: ImagesService,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(UserAdminController.name);

  @Post('admin')
  @UseInterceptors(FileInterceptor('media', { fileFilter: imageFilter, limits: limitImageUpload(), storage: diskStorage(fileStorage()) }))
  async create(@Body() body: CreateUserDto, @UploadedFile() media: Express.Multer.File, @Req() req: Request): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.userService.addAdmin(body, files, req);
    } catch (error) {
      this.logger.error(this.create.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }

  @Post('admin/find')
  async find(@Body() body: SearchDTO, @Req() req: Request): Promise<any> {
    return this.userService.findAdmin(body, req);
  }

  @Delete('admin')
  async delete(@Body() body: ByIdDto, @Req() req: Request): Promise<any> {
    return this.userService.deleteAdmin(body, req);
  }

  @Post('student')
  @UseInterceptors(FileInterceptor('media', { fileFilter: imageFilter, limits: limitImageUpload(), storage: diskStorage(fileStorage()) }))
  async addStudent(@Body() body: CreateUserDto, @UploadedFile() media: Express.Multer.File, @Req() req: Request): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.userService.addStudent(body, files, req);
    } catch (error) {
      this.logger.error(this.addStudent.name);
      console.log(error);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' });
    }
  }
}
