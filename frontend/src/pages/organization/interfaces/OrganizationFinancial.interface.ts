import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { Expense } from './Expense.interface';
import { Income } from './Income.interface';
import { CompletionStatus } from '../enums/CompletionStatus.enum';
import { FinancialType } from '../enums/FinancialType.enum';

export interface IOrganizationFinancial extends BaseEntity {
  type: FinancialType;
  numberOfEmployees: number;
  year: number;
  total: number;
  data: Partial<Income> | Partial<Expense> | null;
  status: CompletionStatus;
}
