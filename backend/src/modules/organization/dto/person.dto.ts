import { IsAlpha, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class Person {
  @IsString()
  @Matches(REGEX.NAME)
  fullName: string;

  @IsAlpha()
  role: string;
}
