import { IsNumber, IsPositive, Max } from 'class-validator';
import { MAX_MONEY } from '../constants/values.constants';

export class Income {
  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  membershipFeeIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  donationsIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  twoPercentIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  sponsorshipIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  economicActivityIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  otherIncome: number;

  @IsNumber()
  @IsPositive()
  @Max(MAX_MONEY)
  financialIncome: number;
}
