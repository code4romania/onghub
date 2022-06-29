import { IsNumber, IsString, Matches, Max } from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class Report {
  @IsString()
  @Matches(REGEX.LINK)
  link: string;

  @IsNumber()
  @Max(new Date().getFullYear())
  year: number;
}
