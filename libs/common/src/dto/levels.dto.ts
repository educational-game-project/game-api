import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ByIdDto } from './byId.dto';
import { GameType } from '../enums/gameType.enum';

export class initLevelDTO {
    @IsNotEmpty()
    @IsNumber()
    current: number;

    @IsNotEmpty()
    @IsNumber()
    max: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(GameType)
    game: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}

export class getLevelDTO {
    @IsNotEmpty()
    @IsString()
    @IsEnum(GameType)
    game: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}