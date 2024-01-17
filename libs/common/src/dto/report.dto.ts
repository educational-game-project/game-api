import { PartialType } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber } from "class-validator";

export enum ReportType {
  SUCCESS = "Success",
  FAILED = "Failed",
}

export class CreateReportDto {
  @IsNotEmpty()
  @IsMongoId()
  game: string;

  @IsNotEmpty()
  @IsEnum(ReportType)
  type: string;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsNumber()
  time: number;
}

export class UpdateReportDto extends PartialType(CreateReportDto) { }
