import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class initLevelDTO {
  @IsNotEmpty()
  @IsMongoId()
  game: string;

  @IsNotEmpty()
  @IsNumber()
  current: number;

  @IsOptional()
  @IsNumber()
  liveLeft?: number = 3;
}
