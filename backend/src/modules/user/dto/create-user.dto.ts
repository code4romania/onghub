import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsPhoneValid } from 'src/common/decorators/is-phone-valid.decorator';
import { Access } from 'src/modules/application/interfaces/application-access.interface';
import { Role } from '../enums/role.enum';

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
  @IsPhoneValid()
  phone: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsNumber()
  organizationId: number;

  @IsOptional()
  @IsArray()
  applicationAccess?: Access[];
}
