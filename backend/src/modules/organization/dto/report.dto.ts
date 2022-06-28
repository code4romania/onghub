import { IsNumber, IsString, Matches, Max } from 'class-validator';

export class Report {
  @IsString()
  @Matches(/^(http(s)?:\/\/)/)
  link: string;

  @IsNumber()
  @Max(new Date().getFullYear())
  year: number;
}
