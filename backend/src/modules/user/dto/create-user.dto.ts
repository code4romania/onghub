import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @Matches(REGEX.NAME)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PHONE)
  phone: string;

  @IsNumber()
  organizationId: number;
}
