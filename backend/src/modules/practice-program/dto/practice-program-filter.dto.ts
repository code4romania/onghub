import { OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { WorkingHours } from '../enums/working-hours.enum';

export class PracticeProgramFilterDto extends OmitType(BaseFilterDto, [
  'orderBy',
  'orderDirection',
]) {
  @IsNumber()
  @IsOptional()
  locationId?: number;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  faculties?: number[];

  @IsEnum(WorkingHours)
  @IsOptional()
  workingHours?: WorkingHours;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  domains?: number[];

  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
