import { PartialType } from '@nestjs/mapped-types';

export class CreateAnalysisDto {}

export class UpdateAnalysisDto extends PartialType(CreateAnalysisDto) {}
