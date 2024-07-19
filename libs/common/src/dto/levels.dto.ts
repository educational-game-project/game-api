import { IsMongoId, IsNotEmpty } from "class-validator";

export class InitLevelDTO {
  @IsNotEmpty()
  @IsMongoId()
  game: string;
}
