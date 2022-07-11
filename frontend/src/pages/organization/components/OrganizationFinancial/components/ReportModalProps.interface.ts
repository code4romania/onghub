import { Expense } from '../interfaces/Expense';
import { Income } from '../interfaces/Income';

export interface ReportModalProps {
  onClose: () => void;
  year?: number;
  total?: number;
  readonly?: boolean;
  defaultValue?: Partial<Expense> | Partial<Income> | null;
  onSave: (data: Partial<Expense> | Partial<Income>) => void;
}
