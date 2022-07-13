import currency from 'currency.js';
import { format } from 'date-fns';

export const formatCurrency = (value: number | string): string =>
  currency(value, { separator: ',', precision: 0, symbol: '' }).format();

export const formatDate = (value: Date | string): string => format(new Date(value), 'd/L/y');
