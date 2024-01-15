import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { GameType } from "../enums/gameType.enum";
import { PartialType } from "@nestjs/swagger";
import { SearchDTO } from "./search.dto";

export class DefineGameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  maxLevel: number;
}

export class GameNameDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(GameType)
  game: string;
}

export class ListGameDTO extends PartialType(SearchDTO) {
  @IsOptional()
  @IsString()
  author?: string;
}

export class EditGameDTO extends PartialType(DefineGameDTO) {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}