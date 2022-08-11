import { IsNumber, IsPositive, Max } from 'class-validator';
import { MAX_MONEY } from '../constants/values.constants';

export class Expense {
  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  netSalaries: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  cas: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  economicActivityDirectExpense: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  administrativeExpense: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  transportAndAccommodation: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  catering: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  production: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  softwareServices: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  advertising: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  otherTaxes: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  otherExpense: number;
}
