import { IsOptional, IsString, MinLength } from 'class-validator';

export class CitySearchDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly search: string;
}
