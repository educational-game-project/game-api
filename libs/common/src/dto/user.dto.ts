import { PartialType } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsMongoId()
  schoolId?: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ByUserIdDTO {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
