import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';

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
  beneficiaries?: number[];
}
