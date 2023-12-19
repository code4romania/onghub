import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateOrganizationActivityDto } from './update-organization-activity.dto';
import { UpdateOrganizationFinancialDto } from './update-organization-financial.dto';
import { UpdateOrganizationGeneralDto } from './update-organization-general.dto';
import { UpdateOrganizationLegalDto } from './update-organization-legal.dto';
import { UpdateOrganizationReportDto } from './update-organization-report.dto';

export class UpdateOrganizationDto {
  /* Organization General */
  @IsOptional()
  @Type(() => UpdateOrganizationGeneralDto)
  @ValidateNested()
  general?: UpdateOrganizationGeneralDto;

  /* Organization Activity */
  @IsOptional()
  @Type(() => UpdateOrganizationActivityDto)
  @ValidateNested()
  activity?: UpdateOrganizationActivityDto;

  /* Organization Legal */
  @IsOptional()
  @Type(() => UpdateOrganizationLegalDto)
  @ValidateNested()
  legal?: UpdateOrganizationLegalDto;

  /* Organization Financial */
  @IsOptional()
  @Type(() => UpdateOrganizationFinancialDto)
  @ValidateNested()
  financial?: UpdateOrganizationFinancialDto;

  /* Organization Report */
  @IsOptional()
  @Type(() => UpdateOrganizationReportDto)
  @ValidateNested()
  report?: UpdateOrganizationReportDto;
}
