import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { INTERACTION_UID } from 'src/modules/oidc/interaction-client-name';

const trimLower = ({ value }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class RequestLoginDto {
  @Transform(trimLower)
  @IsEmail()
  @MaxLength(254)
  email: string;

  /** The pending OIDC interaction (/interaction/:uid), so the email can name the client app. */
  @IsOptional()
  @IsString()
  @Matches(INTERACTION_UID)
  interaction?: string;
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
