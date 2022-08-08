import { IsNumber, IsPositive, Max } from 'class-validator';

export class Income {
  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  membershipFeeIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  donationsIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  twoPercentIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  sponsorshipIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  economicActivityIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  otherIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  financialIncome: number;
}
