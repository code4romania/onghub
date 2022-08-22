import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { MAX_REPORT } from '../constants/values.constants';

export class UpdateOrganizationReportDto {
  @IsNumber()
  reportId: number;

  @IsNumber()
  @IsOptional()
  @Max(MAX_REPORT)
  @IsPositive()
  numberOfVolunteers?: number;

  @IsNumber()
  @IsOptional()
  @Max(MAX_REPORT)
  @IsPositive()
  numberOfContractors?: number;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  report?: string;
}
