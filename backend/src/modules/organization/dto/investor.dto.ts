import { IsArray, IsString, Length, Matches } from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class Investor {
  @IsString()
  @Length(10, 100)
  @Matches(REGEX.NAME)
  name: string;

  @IsArray()
  years: number[];
}
