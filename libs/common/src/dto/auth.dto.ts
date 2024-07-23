import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class LoginUserDTO {
  @ApiProperty({ required: true, example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class LoginAdminDTO {
  @ValidateIf((e) => !!e)
  @ApiProperty({ required: true, example: "admin@example.com" })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: true, example: "password" })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ReauthDTO {
  @ApiProperty({ required: true, example: "refresh_token" })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class ChangePasswordDTO {
  @ApiProperty({ required: true, example: "password" })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ required: true, example: "password" })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
