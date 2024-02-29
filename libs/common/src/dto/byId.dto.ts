import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";

export class ByIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class IdsDTO {
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  ids: string[];
}

export class ByUserIdAndGameIdDTO {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}
