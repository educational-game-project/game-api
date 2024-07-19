import { IsMongoId, IsNotEmpty } from "class-validator";

export class ByIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ByUserIdAndGameIdDTO {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}
