import { IsNumber, IsString } from 'class-validator';

export class Report {
  @IsString()
  link: string;

  @IsNumber()
  year: number;
}
