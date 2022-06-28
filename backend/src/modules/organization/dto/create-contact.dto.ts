import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(10)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}
