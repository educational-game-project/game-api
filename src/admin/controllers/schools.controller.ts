import { FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";
import { SchoolAdminService } from "../services/schools.service";
import { Body, Controller, Delete, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, HttpException, HttpCode, } from "@nestjs/common";
import { Request } from "express";
import { imageFilter, limitImageUpload, } from "@app/common/utils/validators/file.validator";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { CreateSchoolDTO, EditSchoolDTO } from "@app/common/dto/school.dto";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { TargetLogEnum } from "@app/common/enums/log.enum";
import { LogsService } from "../services/log.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Admin - Schools")
@Roles([UserRole.SUPER_ADMIN])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/schools")
export class SchoolAdminController {
  constructor(
    private schoolService: SchoolAdminService,
    @Inject(ImagesService) private imageService: ImagesService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(SchoolAdminService.name);

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async create(
    @Body() body: CreateSchoolDTO,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define([media]) : [];

      return this.schoolService.create(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${req?.user?.name} failed to add school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.create.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async edit(
    @Body() body: EditSchoolDTO,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media?.length ? await this.imageService.define(media) : [];

      return this.schoolService.edit(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${req?.user?.name} failed to edit school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.edit.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("find")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async find(@Body() body: SearchDTO, @Req() req: Request): Promise<any> {
    return this.schoolService.find(body, req);
  }

  @Post("detail")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async detail(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.schoolService.detail(body, req);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async delete(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.schoolService.delete(body, req);
  }
}
