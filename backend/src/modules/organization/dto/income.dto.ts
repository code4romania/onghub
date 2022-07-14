import { IsNumber } from 'class-validator';

export class Income {
  @IsNumber()
  membershipFeeIncome: number;

  @IsNumber()
  donationsIncome: number;

  @IsNumber()
  twoPercentIncome: number;

  @IsNumber()
  sponsorshipIncome: number;

  @IsNumber()
  economicActivityIncome: number;

  @IsNumber()
  otherIncome: number;

  @IsNumber()
  financialIncome: number;
}
