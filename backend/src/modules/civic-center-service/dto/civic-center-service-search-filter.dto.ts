import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { AgeCategory } from 'src/modules/practice-program/enums/age-category.enum';

export class CivicCenterServiceSearchFilterDto extends OmitType(BaseFilterDto, [
  'orderBy',
  'orderDirection',
]) {
  @IsNumber()
  @IsOptional()
  organizationId?: number;

  @IsNumber()
  @IsOptional()
  locationId?: number;

  @IsArray()
  @IsOptional()
  domains?: number[];

  @IsArray()
  @IsOptional()
  ageCategories?: AgeCategory[];
}
