import { IsEnum, IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { ReportType } from "../enums/reportType.enum";

export class CreateReportDTO {
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
