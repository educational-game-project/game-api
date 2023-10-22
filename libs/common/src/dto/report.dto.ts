import { PartialType } from '@nestjs/mapped-types';

export class CreateReportDto {}

export class UpdateReportDto extends PartialType(CreateReportDto) {}
