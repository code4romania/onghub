import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { Investor } from './investor.dto';
import { Report } from './report.dto';

export class CreateOrganizationReportDto {
  @IsNumber()
  @Length(1, 5)
  numberOfVolunteers: number;

  @IsNumber()
  @Length(1, 3)
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
