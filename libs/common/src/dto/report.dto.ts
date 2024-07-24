import { IsEnum, IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { ReportType } from "../enums/reportType.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReportDTO {
  @ApiProperty({ type: String, required: true, example: "5f9f1c9c9c9c9c9c9c9c9c9c" })
  @IsNotEmpty()
  @IsMongoId()
  game: string;

  @ApiProperty({ type: String, required: true, enum: ReportType, example: "Success" })
  @IsNotEmpty()
  @IsEnum(ReportType)
  type: string;

  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  level: number;

  @ApiProperty({ type: Number, required: true, example: 10 })
  @IsNotEmpty()
  @IsNumber()
  time: number;
}
