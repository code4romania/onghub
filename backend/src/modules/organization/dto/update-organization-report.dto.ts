import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, ValidateNested } from 'class-validator';
import { Report } from '../entities';

export class UpdateOrganizationReportDto {
  @IsNumber()
  @IsOptional()
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  @Type(() => Report)
  @ValidateNested()
  report?: Partial<Report>;
}
