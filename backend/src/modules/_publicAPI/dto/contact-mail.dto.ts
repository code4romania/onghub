import { IsString, Length, MaxLength, MinLength } from 'class-validator';

export class ContactMailDto {
  @IsString()
  @Length(3, 200)
  from: string;

  @IsString()
  @MaxLength(1500)
  text: string;

  @IsString()
  @MinLength(3)
  sender: string;

  @IsString()
  type: string;
}
