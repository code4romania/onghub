import { IsNumber, IsPositive, Max } from 'class-validator';

export class Expense {
  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  netSalaries: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  cas: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  economicActivityDirectExpense: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  administrativeExpense: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  transportAndAccommodation: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  catering: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  production: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  softwareServices: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  advertising: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  otherTaxes: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  otherExpense: number;
}
