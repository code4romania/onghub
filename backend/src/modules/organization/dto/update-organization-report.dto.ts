import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateInvestorDto } from './update-investor.dto';
import { UpdatePartnerDto } from './update-partner.dto';
import { UpdateReportDto } from './update-report.dto';

export class UpdateOrganizationReportDto {
  @IsOptional()
  @Type(() => UpdateReportDto)
  @ValidateNested()
  reports?: UpdateReportDto[];

  @IsOptional()
  @Type(() => UpdatePartnerDto)
  @ValidateNested()
  partners?: UpdatePartnerDto[];

  @IsOptional()
  @Type(() => UpdateInvestorDto)
  @ValidateNested()
  investors?: UpdateInvestorDto[];
}
