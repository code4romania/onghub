import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrganizationFinancialDto {
  @ApiProperty()
  @IsNumber()
  numberOfEmployees: number;

  @ApiProperty()
  @IsNumber()
  totalIncome: number;

  @ApiProperty()
  @IsNumber()
  totalExpenses: number;
}
