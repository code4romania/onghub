import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsValidPhone } from 'src/common/decorators/validation.decorator';

export class OngContact {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @Matches(REGEX.NAME)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;
}
