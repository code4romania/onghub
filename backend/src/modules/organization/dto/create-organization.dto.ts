import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateOrganizationActivityDto } from './create-organization-activity.dto';
import { CreateOrganizationFinancialDto } from './create-organization-financial.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';
import { CreateOrganizationLegalDto } from './create-organization-legal.dto';
import { CreateOrganizationReportDto } from './create-organization-report.dto';
export class CreateOrganizationDto {
  /* Organization General */
  @Type(() => CreateOrganizationGeneralDto)
  @ValidateNested()
  general: CreateOrganizationGeneralDto;

  /* Organization Activity */
  @Type(() => CreateOrganizationActivityDto)
  @ValidateNested()
  activity: CreateOrganizationActivityDto;

  /* Organization Legal */
  @Type(() => CreateOrganizationLegalDto)
  @ValidateNested()
  legal: CreateOrganizationLegalDto;

  /* Organization Financial */
  @Type(() => CreateOrganizationFinancialDto)
  @ValidateNested()
  financial: CreateOrganizationFinancialDto[];

  /* Organization Report */
  @Type(() => CreateOrganizationReportDto)
  @ValidateNested()
  report: CreateOrganizationReportDto;
}
