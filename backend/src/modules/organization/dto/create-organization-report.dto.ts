import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { IInvestor } from '../interfaces/inverstors.interface';
import { IReport } from '../interfaces/report.interface';

export class CreateOrganizationReportDto {
  @ApiProperty()
  @IsNumber()
  numberOfVolunteers: number;

  @ApiProperty()
  @IsNumber()
  numberOfContractors: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  reports?: IReport[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  donors?: IInvestor[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  partners?: IInvestor[];
}
