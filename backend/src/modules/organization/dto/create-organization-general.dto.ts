import { Type } from 'class-transformer';
import {
  IsAlpha,
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
import { CreateContactDto } from 'src/modules/organization/dto/create-contact.dto';
import { OrganizationType } from '../enums/organization-type.enum';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreateOrganizationGeneralDto {
  /* 
  Organization name 
  */
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.NAME)
  @Length(3, 100)
  name: string;

  /* Organization alias */
  @IsAlpha()
  @IsNotEmpty()
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

  /* Organization year created */
  @Max(new Date().getFullYear())
  @IsNumber()
  yearCreated: number;

  /* 
  Organization CUI/CIF 
  @example RO1112345
  */
  @IsString()
  @Length(2, 12)
  @Matches(REGEX.CUI)
  cui: string;

  /* 
  Organization Register of Associations and Foundations Number 
  @example 1249/A/2020
  */
  @IsString()
  @Length(10, 12)
  @Matches(REGEX.RAF)
  rafNumber: string;

  /* Organization short description */
  @IsString()
  @IsOptional()
  @Length(200, 250)
  @Matches(REGEX.DESCRIPTION)
  shortDescription?: string;

  /* Organization long description */
  @IsString()
  @IsOptional()
  @Length(250, 500)
  @Matches(REGEX.DESCRIPTION)
  description?: string;

  // TODO: this should be removed once we have the attachment table
  /* Organization logo/link */
  @IsString()
  logo: string;

  /* 
  Organization website 
  @example http://www.google.com
  */
  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  website?: string;

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
  @Length(4, 4)
  donationSMS?: string;

  /* Organization donation keyword */
  @IsAlpha()
  @IsOptional()
  @Length(10, 10)
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
}
