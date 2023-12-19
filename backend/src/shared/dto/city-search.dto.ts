import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CitySearchDto {
  @IsNumber()
  @IsOptional()
  countyId?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  search?: string;

  @IsNumber()
  @IsOptional()
  cityId?: number;
}
