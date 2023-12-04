import { IsNotEmpty, IsNumber } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { GameNameDTO } from "./global.dto";

export class initLevelDTO extends PartialType(GameNameDTO) {
  @IsNotEmpty()
  @IsNumber()
  current: number;

  @IsNotEmpty()
  @IsNumber()
  max: number;
}
