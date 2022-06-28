import { IsAlpha, IsString, Matches } from 'class-validator';

export class Person {
  @IsString()
  @Matches(/^[a-zA-Z-]*$/)
  fullName: string;

  @IsAlpha()
  role: string;
}
