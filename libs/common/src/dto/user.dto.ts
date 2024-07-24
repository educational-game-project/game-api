import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDTO {
  @ApiProperty({ type: String, required: true, example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false, example: "john@example.com" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ type: String, required: false, example: "+6288888888888" })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ type: String, required: false, example: "password" })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ type: String, required: false, example: "5f8d9e9e9e9e9e9e9e9e9e9" })
  @IsOptional()
  @IsMongoId()
  schoolId?: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @ApiProperty({ type: String, required: true, example: "5f8d9e9e9e9e9e9e9e9e9e9" })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class ByUserIdDTO {
  @ApiProperty({ type: String, required: true, example: "5f8d9e9e9e9e9e9e9e9e9e9" })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
