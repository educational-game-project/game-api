import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { GameType } from "../enums/gameType.enum";

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