import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class UpdateOrganizationReportDto {
  @IsNumber()
  reportId: number;

  @IsNumber()
  @IsOptional()
  numberOfVolunteers: number;

  @IsNumber()
  @IsOptional()
  numberOfContractors: number;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  report: string;
}
