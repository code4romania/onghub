import { IsNumber, IsString, Matches, Max, Min } from 'class-validator';

export class Report {
  @IsString()
  @Matches(/^(http(s)?:\/\/)/)
  link: string;

  @IsNumber()
  @Min(1900)
  @Max(2022)
  year: number;
}
