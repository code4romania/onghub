import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { WorkingHours } from '../enums/working-hours.enum';

export class PracticeProgramFilterDto extends BaseFilterDto {
  @IsNumber()
  @IsOptional()
  locationId?: number;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  faculties?: number[];

  @IsEnum(WorkingHours)
  @IsOptional()
  workingHous?: WorkingHours;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  domains?: number[];
}
