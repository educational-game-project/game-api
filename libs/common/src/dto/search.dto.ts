import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchDTO {
  @IsOptional()
  @IsString()
  public readonly search?: any;

  @IsOptional()
  @IsNumber()
  public readonly page?: number;

  @IsOptional()
  @IsNumber()
  public readonly limit?: number;

  @IsOptional()
  @IsMongoId()
  public readonly schoolId?: string;
}
