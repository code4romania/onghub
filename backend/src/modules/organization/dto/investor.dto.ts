import { IsArray, IsString, Length, Matches } from 'class-validator';

export class Investor {
  @IsString()
  @Length(10, 100)
  @Matches(/^[a-zA-Z-]*$/)
  name: string;

  @IsArray()
  years: number[];
}
