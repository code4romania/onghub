import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Matches,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsPhoneValid } from 'src/common/decorators/is-phone-valid.decorator';
import { ToRoPhoneNumber } from 'src/common/decorators/to-ro-phone-number.decorator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @Matches(REGEX.NAME)
  fullName: string;

  @IsOptional()
  @ValidateIf((o) => o.phone !== null && o.phone !== '')
  @IsString()
  @IsPhoneValid()
  @ToRoPhoneNumber()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}
