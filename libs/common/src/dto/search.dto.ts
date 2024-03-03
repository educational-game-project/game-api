import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchDTO {
  @IsOptional()
  @IsString()
  public readonly search?: any;

  @IsOptional()
  @IsNumber()
  public readonly page?: number = 1;

  @IsOptional()
  @IsNumber()
  public readonly limit?: number = 10;

  @IsOptional()
  @IsMongoId()
  public readonly schoolId?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
