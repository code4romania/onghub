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
import { IsValidPhone } from 'src/common/decorators/validation.decorator';
import { CreateOrganizationDto } from 'src/modules/organization/dto/create-organization.dto';

class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  @Matches(REGEX.NAME)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
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
