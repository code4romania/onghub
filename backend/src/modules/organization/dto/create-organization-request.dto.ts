import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsPhoneValid } from 'src/common/decorators/is-phone-valid.decorator';
import { ToRoPhoneNumber } from 'src/common/decorators/to-ro-phone-number.decorator';
import { Trim } from 'src/common/decorators/trim.decorator';
import { CreateOrganizationDto } from 'src/modules/organization/dto/create-organization.dto';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @Matches(REGEX.NAME)
  @Trim()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ToRoPhoneNumber()
  @IsPhoneValid()
  phone: string;
}

export class CreateOrganizationRequestDto {
  /* Request Admin */
  @Type(() => CreateUserRequestDto)
  @ValidateNested()
  admin: CreateUserRequestDto;

  @Type(() => CreateOrganizationDto)
  @ValidateNested()
  organization: CreateOrganizationDto;
}
