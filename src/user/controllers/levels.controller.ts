import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { LevelsService } from '../services/levels.service';
import { getLevelDTO, initLevelDTO } from '@app/common/dto/levels.dto';

@Controller('levels')
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService
  ) { }

  @Post('init')
  async initLevel(@Body() body: initLevelDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.initLevel(body, req)
  }

  @Post('find')
  async getLevel(@Body() body: getLevelDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.getLevel(body, req)
  }
}
