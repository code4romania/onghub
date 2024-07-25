import { Type } from 'class-transformer';
import {
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
import { ToNumber } from 'src/common/decorators/to-number.decorator';
import { IsPhoneValid } from 'src/common/decorators/is-phone-valid.decorator';
import { OrganizationType } from '../enums/organization-type.enum';
import { Trim } from 'src/common/decorators/trim.decorator';

export class CreateOrganizationGeneralDto {
  /* 
  Organization name 
  */
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  @Trim()
  name: string;

  /* Organization alias */
  @IsNotEmpty()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  @Trim()
  alias: string;

  /* Organization type */
  @IsEnum(OrganizationType)
  type: OrganizationType;

  /* Organization email */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  email: string;

  /* Organization phone */
  @IsString()
  @IsNotEmpty()
  @IsPhoneValid()
  phone: string;

  /* 
  Organization name 
  */
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Trim()
  address?: string;

  /* Organization year created */
  @IsNumber()
  @Type(() => Number)
  yearCreated: number;

  /* 
  Organization CUI/CIF 
  @example RO1112345
  */
  @IsString()
  @MaxLength(12)
  @Matches(REGEX.CUI)
  @Trim()
  cui: string;

  @IsString()
  @MaxLength(30)
  @Trim()
  associationRegistryNumber: string;

  @IsString()
  @MaxLength(10)
  @Trim()
  associationRegistryPart: string;

  @IsString()
  @MaxLength(10)
  @Trim()
  associationRegistrySection: string;

  @IsString()
  @MaxLength(100)
  @Trim()
  associationRegistryIssuer: string;

  @IsString()
  @MaxLength(30)
  @Trim()
  nationalRegistryNumber: string;

  /* 
  Organization Register of Associations and Foundations Number 
  @example 1249/A/2020
  */
  @IsString()
  @MaxLength(20)
  @Matches(REGEX.RAF)
  @Trim()
  rafNumber: string;

  /* Organization short description */
  @IsString()
  @Length(50, 275) // In the frontend there should be a 250 limit, but due to '\r\n' characters being counted, we need to increase the limit
  shortDescription?: string;

  /* Organization long description */
  @IsString()
  @Length(500, 2100) // In the frontend there should be a 2000 limit, but due to '\r\n' characters being counted, we need to increase the limit
  description?: string;

  /* 
  Organization website 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  website: string;

  /* 
  Organization facebook 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  facebook?: string;

  /* 
  Organization instagram 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  instagram?: string;

  /* 
  Organization twitter 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  twitter?: string;

  /* 
  Organization linkedin 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  linkedin?: string;

  /* 
  Organization tiktok 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  tiktok?: string;

  /* 
  Organization donation website 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  donationWebsite?: string;

  /* 
  Organization donation redirect link 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  redirectLink?: string;

  /* Organization donation sms number */
  @IsString()
  @IsOptional()
  @Matches(REGEX.SMS)
  donationSMS?: string;

  /* Organization donation keyword */
  @IsOptional()
  @MaxLength(10)
  @Matches(REGEX.NAME)
  donationKeyword?: string;

  /* Organization county id */
  @IsNumber()
  @ToNumber()
  countyId: number;

  /* Organization city id */
  @IsNumber()
  @ToNumber()
  cityId: number;

  /* logo */
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Trim()
  organizationAddress?: string;

  @IsNumber()
  @ToNumber()
  @IsOptional()
  organizationCountyId?: number;

  @IsNumber()
  @ToNumber()
  @IsOptional()
  organizationCityId?: number;
}
