import { IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { SearchDTO } from "./search.dto";

export class DefineGameDTO {
  @ApiProperty({ type: String, required: true, example: "Game Name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true, example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ type: String, required: false, example: "Game Description" })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: String, required: false, example: "Game Category" })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ type: Number, required: true, example: 10 })
  @IsNotEmpty()
  @IsNumberString()
  maxLevel: number;

  @ApiProperty({ type: Number, required: true, example: 3 })
  @IsNotEmpty()
  @IsNumberString()
  maxRetry: number;

  @ApiProperty({ type: Number, required: true, example: 60 })
  @IsNotEmpty()
  @IsNumberString()
  maxTime: number;
}

export class ListGameDTO extends PartialType(SearchDTO) {
  @ApiProperty({ type: String, required: false, example: "John Doe" })
  @IsOptional()
  @IsString()
  author?: string;
}

export class EditGameDTO extends PartialType(DefineGameDTO) {
  @ApiProperty({ type: String, required: true, example: "5f9f1b9b9c9d1c0e8c8b9b9" })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ListGameByAuthorDTO {
  @ApiProperty({ type: String, required: true, example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  author: string;
}

export class ByGameIdDTO {
  @ApiProperty({ type: String, required: true, example: "5f9f1b9b9c9d1c0e8c8b9b9" })
  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}