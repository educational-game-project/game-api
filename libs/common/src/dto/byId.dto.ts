import { IsMongoId, IsNotEmpty } from "class-validator";

export class ByIdDTO {
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
