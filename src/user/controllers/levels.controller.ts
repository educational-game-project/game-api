import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnalysisService } from 'src/user/services/analysis.service';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: AnalysisService) { }
}
