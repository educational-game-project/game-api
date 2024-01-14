import { Body, Controller, Delete, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, HttpException, } from "@nestjs/common";
import { GameAdminService } from "../services/game.service";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Request } from "express";
import { imageFilter, limitImageUpload, } from "@app/common/utils/validators/file.validator";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";
import { DefineGameDTO } from "@app/common/dto/game.dto";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/games")
export class GameAdminController {
  constructor(
    private readonly gameService: GameAdminService,
    @Inject(ImagesService) private imageService: ImagesService,
  ) { }

  private readonly logger = new Logger(GameAdminController.name);

  @Roles([UserRole.SUPER_ADMIN])
  @Post()
  @ResponseStatusCode()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async defineGame(
    @Body() body: DefineGameDTO,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define(media) : [];

      return this.gameService.defineGame(body, files, req);
    } catch (error) {
      this.logger.error(this.defineGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}