import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const trimLower = ({ value }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class RequestLoginDto {
  @Transform(trimLower)
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class LoginLinkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  token: string;
}

export class LoginCodeDto {
  @Transform(trimLower)
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}
