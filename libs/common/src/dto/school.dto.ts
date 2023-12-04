import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ByIdDto } from './byId.dto';

export class CreateSchoolDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class EditSchoolDTO extends PartialType(ByIdDto) {
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
