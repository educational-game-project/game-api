import { PartialType } from '@nestjs/swagger';

export class CreateReportDto { }

export class UpdateReportDto extends PartialType(CreateReportDto) { }
