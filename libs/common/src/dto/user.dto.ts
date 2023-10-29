import { PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto { }

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class AddAdminDTO {
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

    @IsNotEmpty()
    @IsMongoId()
    schoolId?: string;
}
