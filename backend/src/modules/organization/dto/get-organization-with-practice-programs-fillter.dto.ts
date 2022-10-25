import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';

export class GetOrganizationWithPracticeProgramsFilterDto extends OmitType(
  BaseFilterDto,
  ['orderBy', 'orderDirection', 'start', 'end'],
) {
  @IsArray()
  @IsOptional()
  domains?: number[];

  @IsNumber()
  @IsOptional()
  cityId?: number;
}
