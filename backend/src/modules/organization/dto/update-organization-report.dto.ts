import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { MAX_REPORT } from '../constants/values.constants';

export class UpdateOrganizationReportDto {
  @IsNumber()
  @Type(() => Number)
  reportId: number;

  @IsNumber()
  @IsOptional()
  @Max(MAX_REPORT)
  @Min(0)
  @Type(() => Number)
  numberOfVolunteers?: number;

  @IsNumber()
  @IsOptional()
  @Max(MAX_REPORT)
  @Min(0)
  @Type(() => Number)
  numberOfContractors?: number;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  report?: string;
}
