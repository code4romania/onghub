export enum FinancialType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum CompletionStatus {
  COMPLETED = 'COMPLETED',
  NOT_COMPLETED = 'NOT_COMPLETED',
}

export interface IOrganizationFinancial {
  id: number;
  type: FinancialType;
  numberOfEmployees: number;
  year: number;
  total: number;
  updatedOn: Date;
  status: CompletionStatus;
}
