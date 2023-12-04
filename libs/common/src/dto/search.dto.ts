import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchDTO {
  @IsOptional()
  @IsString()
  public readonly search?: any;

  @IsNumber()
  @IsOptional()
  public readonly page?: number;

  @IsNumber()
  @IsOptional()
  public readonly limit?: number;
}
