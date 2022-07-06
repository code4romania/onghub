import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Income } from './income.dto';
import { Expense } from './expense.dto';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { Type } from 'class-transformer';

export class CreateOrganizationFinancialDto {
  @IsEnum(FinancialType)
  type: FinancialType;

  @Type(() => Income)
  @IsOptional()
  income?: Income;

  @Type(() => Expense)
  @IsOptional()
  expense?: Expense;
}
