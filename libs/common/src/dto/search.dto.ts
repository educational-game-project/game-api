import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchDTO {
  @ApiProperty({ type: "string", required: false, example: "Search Query" })
  @IsOptional()
  @IsString()
  public readonly search?: any;

  @ApiProperty({ type: "number", required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  public readonly page?: number = 1;

  @ApiProperty({ type: "number", required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  public readonly limit?: number = 10;

  @ApiProperty({ type: "string", required: false, example: "5f6c3b5b5d6c3b5b5b5b5b5" })
  @IsOptional()
  @IsMongoId()
  public readonly schoolId?: string;

  @ApiProperty({ type: "boolean", required: false, example: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
