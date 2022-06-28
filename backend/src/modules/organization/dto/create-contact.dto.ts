import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  @Matches(/^[a-zA-Z-]*$/)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}
