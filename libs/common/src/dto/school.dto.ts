import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { ByIdDTO } from "./byId.dto";

export class CreateSchoolDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class EditSchoolDTO extends PartialType(ByIdDTO) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mediaIds: string[];
}
