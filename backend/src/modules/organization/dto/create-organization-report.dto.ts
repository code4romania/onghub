import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Investor } from './inverstor.dto';
import { Report } from './report.dto';

export class CreateOrganizationReportDto {
  @IsNumber()
  numberOfVolunteers: number;

  @IsNumber()
  numberOfContractors: number;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Report)
  reports?: Report[];

  @Type(() => Investor)
  @IsOptional()
  @IsArray()
  donors?: Investor[];

  @Type(() => Investor)
  @IsOptional()
  @IsArray()
  partners?: Investor[];
}
