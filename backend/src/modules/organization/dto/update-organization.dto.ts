import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateOrganizationActivityDto } from './update-organization-activity.dto';
import { UpdateOrganizationFinancialDto } from './update-organization-financial.dto';
import { UpdateOrganizationGeneralDto } from './update-organization-general.dto';
import { UpdateOrganizationLegalDto } from './update-organization-legal.dto';
import { UpdateOrganizationReportDto } from './update-organization-report.dto';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Organization General',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationGeneralDto)
  @ValidateNested()
  general: UpdateOrganizationGeneralDto;

  @ApiPropertyOptional({
    description: 'Organization Activity',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationActivityDto)
  @ValidateNested()
  activity: UpdateOrganizationActivityDto;

  @ApiPropertyOptional({
    description: 'Organization Legal',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationLegalDto)
  @ValidateNested()
  legal: UpdateOrganizationLegalDto;

  @ApiPropertyOptional({
    description: 'Organization Financial',
    type: () => UpdateOrganizationFinancialDto,
  })
  @IsOptional()
  @Type(() => UpdateOrganizationFinancialDto)
  @ValidateNested()
  financial: UpdateOrganizationFinancialDto;

  @ApiPropertyOptional({
    description: 'Organization Report',
    type: () => UpdateOrganizationReportDto,
  })
  @IsOptional()
  @Type(() => UpdateOrganizationReportDto)
  @ValidateNested()
  report: UpdateOrganizationReportDto;
}
