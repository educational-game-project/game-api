import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import {
  imageFilter,
  limitImageUpload,
} from "@app/common/utils/validators/file.validator";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDto } from "@app/common/dto/byId.dto";
import { UserAdminService } from "../services/user.service";
import { CreateUserDto } from "@app/common/dto/user.dto";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ResponseStatusCode } from "@app/common/response/response.decorator";

@Controller("admin/user")
export class UserAdminController {
  constructor(
    private readonly userService: UserAdminService,
    @Inject(ImagesService) private imageHelper: ImagesService,
  ) { }

  private readonly logger = new Logger(UserAdminController.name);

  @Post("admin")
  @Roles([UserRole.SUPER_ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.userService.addAdmin(body, files, req);
    } catch (error) {
      this.logger.error(this.create.name);
      console.log(error?.message);;
      throw new HttpException(
        error?.response ?? error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("admin/find")
  @Roles([UserRole.SUPER_ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  async find(@Body() body: SearchDTO, @Req() req: Request): Promise<any> {
    return this.userService.findAdmin(body, req);
  }

  @Delete("admin")
  @Roles([UserRole.SUPER_ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  async delete(@Body() body: ByIdDto, @Req() req: Request): Promise<any> {
    return this.userService.deleteAdmin(body, req);
  }

  @Post("student")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async addStudent(
    @Body() body: CreateUserDto,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const files = media ? await this.imageHelper.define([media]) : [];

      return this.userService.addStudent(body, files, req);
    } catch (error) {
      this.logger.error(this.addStudent.name);
      console.log(error?.message);;
      throw new HttpException(
        error?.response ?? error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("student/find")
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  async listStudents(
    @Body() body: SearchDTO,
    @Req() req: Request,
  ): Promise<any> {
    return this.userService.listStudents(body, req);
  }
}
