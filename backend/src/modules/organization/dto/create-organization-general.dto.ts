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
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsValidPhone } from 'src/common/decorators/validation.decorator';
import { CreateContactDto } from 'src/modules/organization/dto/create-contact.dto';
import { OrganizationType } from '../enums/organization-type.enum';

export class CreateOrganizationGeneralDto {
  /* 
  Organization name 
  */
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  name: string;

  /* Organization alias */
  @IsNotEmpty()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  alias: string;

  /* Organization type */
  @IsEnum(OrganizationType)
  type: OrganizationType;

  /* Organization email */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  /* Organization phone */
  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;

  /* Organization year created */
  @Max(new Date().getFullYear())
  @IsNumber()
  yearCreated: number;

  /* 
  Organization CUI/CIF 
  @example RO1112345
  */
  @IsString()
  @MaxLength(12)
  @Matches(REGEX.CUI)
  cui: string;

  /* 
  Organization Register of Associations and Foundations Number 
  @example 1249/A/2020
  */
  @IsString()
  @MaxLength(20)
  @Matches(REGEX.RAF)
  rafNumber: string;

  /* Organization short description */
  @IsString()
  @Length(50, 250)
  shortDescription?: string;

  /* Organization long description */
  @IsString()
  @Length(200, 700)
  description?: string;

  /* 
  Organization website 
  @example http://www.google.com
  */
  @IsString()
  @Matches(REGEX.LINK)
  website?: string;

  /* 
  Organization facebook 
  @example http://www.google.com
  */
  @IsString()
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
  @Matches(REGEX.NUMERIC)
  @Length(4, 4)
  donationSMS?: string;

  /* Organization donation keyword */
  @IsOptional()
  @MaxLength(10)
  @Matches(REGEX.NAME)
  donationKeyword?: string;

  /* Organization contact person */
  @Type(() => CreateContactDto)
  @ValidateNested()
  contact: CreateContactDto;

  /* Organization county id */
  @IsNumber()
  countyId: number;

  /* Organization city id */
  @IsNumber()
  cityId: number;

  /* logo */
  @IsString()
  @IsOptional()
  logo?: string;
}
