import { Expense } from './interfaces/Expense';
import { Income } from './interfaces/Income';

export enum FinancialType {
  EXPENSE = 'Expense',
  INCOME = 'Income',
}

export enum CompletionStatus {
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'Not Completed',
}

export interface IOrganizationFinancial {
  id: number;
  type: FinancialType;
  numberOfEmployees: number;
  year: number;
  total: number;
  updatedOn: Date;
  data: Partial<Income> | Partial<Expense> | null;
  status: CompletionStatus;
}
