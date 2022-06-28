import { IsArray, IsString } from 'class-validator';

export class Investor {
  @IsString()
  name: string;

  @IsArray()
  years: number[];
}
