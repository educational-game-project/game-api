import { PartialType } from "@nestjs/swagger";

export class CreateAnalysisDto {}

export class UpdateAnalysisDto extends PartialType(CreateAnalysisDto) {}
