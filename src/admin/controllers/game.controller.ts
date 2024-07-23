import { Body, Controller, Delete, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors, HttpException, HttpCode, } from "@nestjs/common";
import { GameAdminService } from "../services/game.service";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Request } from "express";
import { imageFilter, limitImageUpload, } from "@app/common/utils/validators/file.validator";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { DefineGameDTO, EditGameDTO, ListGameDTO } from "@app/common/dto/game.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { LogsService } from "../services/log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/games")
export class GameAdminController {
  constructor(
    private readonly gameService: GameAdminService,
    @Inject(ImagesService) private imageService: ImagesService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(GameAdminController.name);

  @Post()
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
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
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define(media) : [];

      return this.gameService.defineGame(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.GAME,
        description: `${req?.user?.name} failed to add game`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.defineGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  async editGame(
    @Body() body: EditGameDTO,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define(media) : [];

      return this.gameService.editGame(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.GAME,
        description: `${req?.user?.name} failed to edit game`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.editGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('find')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async listGame(@Body() body: ListGameDTO, @Req() req: Request): Promise<any> {
    return this.gameService.listGame(body, req);
  }

  @Post('detail')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async detailGame(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.gameService.detailGame(body, req);
  }

  @Delete()
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async deleteGame(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.gameService.deleteGame(body, req);
  }
}