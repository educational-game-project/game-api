import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { GameNameDTO } from './global.dto';

export enum ReportType {
    SUCCESS = "Success",
    FAILED = "Failed"
}

export class CreateReportDto extends PartialType(GameNameDTO) {
    @IsNotEmpty()
    @IsEnum(ReportType)
    type: string;

    @IsNotEmpty()
    @IsNumber()
    level: number

    @IsNotEmpty()
    @IsNumber()
    time: number
}

export class UpdateReportDto extends PartialType(CreateReportDto) { }
