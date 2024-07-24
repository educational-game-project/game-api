import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class ByIdDTO {
  @ApiProperty({ type: String, required: true, example: "5f9f1c9c9c9c9c9c9c9c9c9c" })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ByUserIdAndGameIdDTO {
  @ApiProperty({ type: String, required: true, example: "5f9f1c9c9c9c9c9c9c9c9c9c" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ type: String, required: true, example: "5f9f1c9c9c9c9c9c9c9c9c9c" })
  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}
