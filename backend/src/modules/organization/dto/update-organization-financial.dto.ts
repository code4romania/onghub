import { IsNumber, IsObject } from 'class-validator';
import { Income } from './income.dto';
import { Expense } from './expense.dto';

export class UpdateOrganizationFinancialDto {
  @IsNumber()
  id: number;

  @IsObject()
  data: Income | Expense;
}
