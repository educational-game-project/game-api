import { Body, Controller, Delete, HttpStatus, Inject, Logger, Post, Request as Req, UploadedFile, UseGuards, UseInterceptors, HttpException, Get, Put, HttpCode, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { imageFilter, limitImageUpload, } from "@app/common/utils/validators/file.validator";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { UserAdminService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "@app/common/dto/user.dto";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { StudentsService } from "../services/students.service";
import { LogsService } from "../services/log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/user")
export class UserAdminController {
  constructor(
    private readonly userService: UserAdminService,
    private readonly studentsService: StudentsService,
    @Inject(ImagesService) private imageHelper: ImagesService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(UserAdminController.name);

  //////////////////////////////////////////// ADMIN /////////////////////////////////////////////

  @Post("admin")
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async create(
    @Body() body: CreateUserDTO,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.userService.addAdmin(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${req?.user?.name} failed to add admin`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.create.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put("admin")
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async updateAdmin(
    @Body() body: UpdateUserDTO,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.userService.updateAdmin(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.ADMIN,
        description: `${req?.user?.name} failed to edit admin`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.updateAdmin.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("admin/find")
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async find(@Body() body: SearchDTO, @Req() req: Request): Promise<any> {
    return this.userService.findAdmin(body, req);
  }

  @Delete("admin")
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async delete(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.userService.deleteAdmin(body, req);
  }

  @Post("admin/detail")
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async detailAdmin(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.userService.detailAdmin(body, req);
  }

  @Get("profile")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getProfile(@Req() req: Request,): Promise<any> {
    return this.userService.getUserDetail(req);
  }

  @Get("active")
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getActiveUser(@Req() req: Request,): Promise<any> {
    return this.userService.getActiveUser(req);
  }

  //////////////////////////////////////////// STUDENT /////////////////////////////////////////////

  @Post("student")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async addStudent(
    @Body() body: CreateUserDTO,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.studentsService.addStudent(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${req?.user?.name} failed to add student`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.addStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put("student")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async editStudent(
    @Body() body: UpdateUserDTO,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.studentsService.editStudent(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.STUDENT,
        description: `${req?.user?.name} failed to edit student list`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.editStudent.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("student/find")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async listStudents(
    @Body() body: SearchDTO,
    @Req() req: Request,
  ): Promise<any> {
    return this.studentsService.listStudents(body, req);
  }

  @Delete("student")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async deleteStudent(
    @Body() body: ByIdDTO,
    @Req() req: Request,
  ): Promise<any> {
    return this.studentsService.deleteStudent(body, req);
  }

  @Post("student/detail")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async detailStudent(
    @Body() body: ByIdDTO,
    @Req() req: Request,
  ): Promise<any> {
    return this.studentsService.detailStudent(body, req);
  }

  @Get("student/active")
  @Roles([UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async getActiveStudent(@Req() req: Request,): Promise<any> {
    return this.studentsService.getActiveStudent(req);
  }
}
