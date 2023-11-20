import { IsEnum, IsNotEmpty, IsString, } from 'class-validator';
import { GameType } from '../enums/gameType.enum';

export class GameNameDTO {
    @IsNotEmpty()
    @IsString()
    @IsEnum(GameType)
    game: string;
}