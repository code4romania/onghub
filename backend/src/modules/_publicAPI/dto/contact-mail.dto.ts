import { IsString, Length } from 'class-validator';

export class ContactMailDto {
  @IsString()
  @Length(3, 100)
  from: string;

  @IsString()
  @Length(50, 250)
  text: string;

  @IsString()
  @Length(3, 100)
  sender: string;
}
