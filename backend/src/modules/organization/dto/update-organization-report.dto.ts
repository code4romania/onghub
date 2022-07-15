import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, ValidateNested } from 'class-validator';
import { UpdateInvestorDto } from './update-investor.dto';
import { UpdatePartnerDto } from './update-partner.dto';
import { UpdateReportDto } from './update-report.dto';

export class UpdateOrganizationReportDto {
  @IsNumber()
  @IsOptional()
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  @Type(() => UpdateReportDto)
  @ValidateNested()
  report?: UpdateReportDto;

  @IsOptional()
  @Type(() => UpdatePartnerDto)
  @ValidateNested()
  partner?: UpdatePartnerDto;

  @IsOptional()
  @Type(() => UpdateInvestorDto)
  @ValidateNested()
  investor?: UpdateInvestorDto;
}
