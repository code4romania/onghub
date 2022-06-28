import { IsNumber } from 'class-validator';

export class CreateOrganizationFinancialDto {
  @IsNumber()
  numberOfEmployees: number;

  @IsNumber()
  totalIncome: number;

  @IsNumber()
  totalExpenses: number;
}
