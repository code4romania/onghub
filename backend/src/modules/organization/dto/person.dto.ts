import { IsString } from 'class-validator';

export class Person {
  @IsString()
  fullName: string;

  @IsString()
  role: string;
}
