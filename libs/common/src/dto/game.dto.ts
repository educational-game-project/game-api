import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { SearchDTO } from "./search.dto";

export class DefineGameDTO {
  @ApiProperty({ type: "string", required: true, example: "Game Name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: "string", required: true, example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ type: "string", required: false, example: "Game Description" })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: "string", required: false, example: "Game Category" })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ type: "number", required: true, example: 10 })
  @IsNotEmpty()
  @IsNumber()
  maxLevel: number;

  @ApiProperty({ type: "number", required: true, example: 3 })
  @IsNotEmpty()
  @IsNumber()
  maxRetry: number;

  @ApiProperty({ type: "number", required: true, example: 60 })
  @IsNotEmpty()
  @IsNumber()
  maxTime: number;
}

export class ListGameDTO extends PartialType(SearchDTO) {
  @ApiProperty({ type: "string", required: false, example: "John Doe" })
  @IsOptional()
  @IsString()
  author?: string;
}

export class EditGameDTO extends PartialType(DefineGameDTO) {
  @ApiProperty({ type: "string", required: true, example: "5f9f1b9b9c9d1c0e8c8b9b9" })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ListGameByAuthorDTO {
  @ApiProperty({ type: "string", required: true, example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  author: string;
}

export class ByGameIdDTO {
  @ApiProperty({ type: "string", required: true, example: "5f9f1b9b9c9d1c0e8c8b9b9" })
  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}