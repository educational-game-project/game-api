import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnalysisAdminService } from '../services/analysis.service';
import {
  CreateAnalysisDto,
  UpdateAnalysisDto,
} from '@app/common/dto/analysis.dto';

@Controller('admin/analysis')
export class AnalysisAdminController {
  constructor(private readonly analysisService: AnalysisAdminService) {}

  @Post()
  create(@Body() createAnalysisDto: CreateAnalysisDto) {
    return this.analysisService.create(createAnalysisDto);
  }

  @Get()
  findAll() {
    return this.analysisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analysisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnalysisDto: UpdateAnalysisDto,
  ) {
    return this.analysisService.update(+id, updateAnalysisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisService.remove(+id);
  }
}
