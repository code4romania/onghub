import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class Person {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @Matches(REGEX.NAME)
  fullName: string;

  @MinLength(3)
  @MaxLength(100)
  @Matches(REGEX.NAME)
  role: string;
}
