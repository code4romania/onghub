import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { SUPPORTED_SCOPES } from '../oidc.provider-factory';

/** O15: the super admin creates the OIDC client of an application. */
export class CreateOidcClientDto {
  /** Lower-case letters, digits and dashes, e.g. `vic`; it never changes. */
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/)
  clientId: string;

  /** Exact https URLs (http://localhost only where the environment allows it); checked by the service. */
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(2000, { each: true })
  redirectUris: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(2000, { each: true })
  postLogoutRedirectUris?: string[];

  @IsArray()
  @IsIn(SUPPORTED_SCOPES, { each: true })
  scopes: string[];

  /** Skips the consent screen. */
  @IsBoolean()
  firstParty: boolean;
}
