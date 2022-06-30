import { IsNumber, Length } from 'class-validator';

export class CreateOrganizationFinancialDto {
  @IsNumber()
  @Length(1, 10)
  numberOfEmployees: number;

  @IsNumber()
  @Length(1, 10)
  totalIncome: number;

  @IsNumber()
  @Length(1, 10)
  totalExpenses: number;
}
