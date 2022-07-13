import { Expense } from './Expense.interface';
import { Income } from './Income.interface';

export interface ReportModalProps {
  onClose: () => void;
  year?: number;
  total?: number;
  readonly?: boolean;
  defaultValue?: Partial<Expense> | Partial<Income> | null;
  onSave: (data: Partial<Expense> | Partial<Income>) => void;
}
