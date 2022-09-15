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
import { IsValidPhone } from 'src/common/decorators/validation.decorator';
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
  @IsValidPhone()
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
