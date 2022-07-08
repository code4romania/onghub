import { IsNumber } from 'class-validator';

export class Expense {
  @IsNumber()
  netSalaries: number;

  @IsNumber()
  cas: number;

  @IsNumber()
  economicActivityDirectExpense: number;

  @IsNumber()
  administrativeExpense: number;

  @IsNumber()
  transportAndAccommodation: number;

  @IsNumber()
  catering: number;

  @IsNumber()
  production: number;

  @IsNumber()
  softwareServices: number;

  @IsNumber()
  advertising: number;

  @IsNumber()
  otherTaxes: number;

  @IsNumber()
  otherExpense: number;
}
