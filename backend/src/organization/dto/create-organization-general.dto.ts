import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateContactDto } from 'src/common/dto/create-contact-dto';
import { OrganizationType } from '../enums/organization-type.enum';
export class CreateOrganizationGeneralDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  alias: string;

  @IsEnum(OrganizationType)
  type: OrganizationType;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNumber()
  yearCreated: number;

  @IsString()
  @MaxLength(12)
  @MinLength(2)
  cui: string;

  @IsString()
  @MaxLength(12)
  @MinLength(2)
  rafNumber: string;

  @IsString()
  @IsOptional()
  @MinLength(200)
  @MaxLength(250)
  shortDescription: string;

  @IsString()
  @IsOptional()
  @MinLength(250)
  @MaxLength(500)
  description: string;

  // TODO: this should be removed once we have the attachment table
  @IsString()
  logo: string;

  @IsString()
  @IsOptional()
  website: string;

  @IsString()
  @IsOptional()
  facebook: string;

  @IsString()
  @IsOptional()
  instagram: string;

  @IsString()
  @IsOptional()
  twitter: string;

  @IsString()
  @IsOptional()
  linkedin: string;

  @IsString()
  @IsOptional()
  tiktok: string;

  @IsString()
  @IsOptional()
  donationWebsite: string;

  @IsString()
  @IsOptional()
  redirectLink: string;

  @IsString()
  @IsOptional()
  donationSMS: string;

  @IsString()
  @IsOptional()
  donationKeyword: string;

  @Type(() => CreateContactDto)
  @ValidateNested()
  contact: CreateContactDto;

  @IsNumber()
  county_id: number;

  @IsNumber()
  city_id: number;
}
