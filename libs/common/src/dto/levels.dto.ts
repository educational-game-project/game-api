import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class InitLevelDTO {
  @ApiProperty({ type: "string", required: true, example: "5f9f1c9c9c9c9c9c9c9c9c9c" })
  @IsNotEmpty()
  @IsMongoId()
  game: string;
}
