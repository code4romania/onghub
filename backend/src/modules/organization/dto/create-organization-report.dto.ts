import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Investor } from './inverstor.dto';
import { Report } from './report.dto';

export class CreateOrganizationReportDto {
  @ApiProperty()
  @IsNumber()
  numberOfVolunteers: number;

  @ApiProperty()
  @IsNumber()
  numberOfContractors: number;

  @ApiPropertyOptional({
    type: () => [Report],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Report)
  reports?: Report[];

  @ApiPropertyOptional({
    type: [Investor],
  })
  @Type(() => Investor)
  @IsOptional()
  @IsArray()
  donors?: Investor[];

  @ApiPropertyOptional({
    type: [Investor],
  })
  @Type(() => Investor)
  @IsOptional()
  @IsArray()
  partners?: Investor[];
}
