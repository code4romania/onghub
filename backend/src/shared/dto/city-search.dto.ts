import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CitySearchDto {
  @IsNumber()
  countyId: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly search?: string;
}
