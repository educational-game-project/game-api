import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ByIdDTO } from "./byId.dto";

export class CreateSchoolDTO {
  @ApiProperty({ type: String, required: true, example: "School Name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true, example: "123 Main St" })
  @IsOptional()
  @IsString()
  address?: string;
}

export class EditSchoolDTO extends PartialType(ByIdDTO) {
  @ApiProperty({ type: String, required: false, example: "School Name" })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false, example: "123 Main St" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: [String], required: false, example: ["mediaId1", "mediaId2"] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mediaIds: string[];
}
