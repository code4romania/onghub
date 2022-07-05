import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Investor } from './investor.dto';
import { Report } from './report.dto';

export class CreateOrganizationReportDto {
  @IsNumber()
  @Min(0)
  @Max(99999)
  numberOfVolunteers: number;

  @IsNumber()
  @Min(0)
  @Max(999)
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
