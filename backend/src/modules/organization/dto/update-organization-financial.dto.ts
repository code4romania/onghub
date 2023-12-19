import { IsNumber, IsObject } from 'class-validator';
import { Income } from './income.dto';
import { Expense } from './expense.dto';
import { Type } from 'class-transformer';

export class UpdateOrganizationFinancialDto {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsObject()
  data: Income | Expense;
}
