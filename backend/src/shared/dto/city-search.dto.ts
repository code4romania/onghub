import { IsOptional, IsString, MinLength } from 'class-validator';

export class CitySearchDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly search: string;
}
