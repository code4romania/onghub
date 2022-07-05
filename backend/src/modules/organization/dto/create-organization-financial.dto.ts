import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Income } from './income.dto';
import { Expense } from './expense.dto';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { Type } from 'class-transformer';

export class CreateOrganizationFinancialDto {
  @IsEnum(FinancialType)
  type: FinancialType;

  @IsNumber()
  @Min(0)
  @Max(99999)
  numberOfEmployees: number;

  @IsNumber()
  @Max(new Date().getFullYear())
  year: number;

  @IsNumber()
  total: number;

  @IsEnum(CompletionStatus)
  status: CompletionStatus;

  @Type(() => Income)
  @IsOptional()
  income?: Income;

  @Type(() => Expense)
  @IsOptional()
  expense?: Expense;
}
