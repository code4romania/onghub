import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsValidPhone } from 'src/common/decorators/validation.decorator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @Matches(REGEX.NAME)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}
