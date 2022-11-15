import { IsString, Length, MaxLength } from 'class-validator';

export class ContactMailDto {
  @IsString()
  @Length(3, 100)
  from: string;

  @IsString()
  @MaxLength(250)
  text: string;

  @IsString()
  @Length(3, 100)
  sender: string;

  @IsString()
  type: string;
}
