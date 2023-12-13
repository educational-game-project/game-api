import { Request, Controller, Get, Post, Body, Patch, Param, Delete, } from "@nestjs/common";
import { ReportAdminService } from "../services/report.service";
import { CreateReportDto, UpdateReportDto } from "@app/common/dto/report.dto";

@Controller("admin/report")
export class ReportAdminController {
  constructor(private readonly reportService: ReportAdminService) { }

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reportService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reportService.remove(+id);
  }
}
