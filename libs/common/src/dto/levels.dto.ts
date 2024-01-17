import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";

export class initLevelDTO {
  @IsNotEmpty()
  @IsMongoId()
  game: string;

  @IsNotEmpty()
  @IsNumber()
  current: number;
}
