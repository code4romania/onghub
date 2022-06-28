import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateContactDto } from 'src/modules/organization/dto/create-contact.dto';
import { OrganizationType } from '../enums/organization-type.enum';
export class CreateOrganizationGeneralDto {
  /* Organization name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  /* Organization alias */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
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
  @Min(1900)
  @Max(2022)
  @IsNumber()
  yearCreated: number;

  /* Organization CUI/CIF */
  @IsString()
  @MaxLength(12)
  @MinLength(2)
  cui: string;

  /* Organization Register of Associations and Foundations Number */
  @IsString()
  @MaxLength(12)
  @MinLength(2)
  rafNumber: string;

  /* Organization short description */
  @IsString()
  @IsOptional()
  @MinLength(200)
  @MaxLength(250)
  shortDescription?: string;

  /* Organization long description */
  @IsString()
  @IsOptional()
  @MinLength(250)
  @MaxLength(500)
  description?: string;

  // TODO: this should be removed once we have the attachment table
  /* Organization logo/link */
  @IsString()
  logo: string;

  /* Organization website */
  @IsString()
  @IsOptional()
  website?: string;

  /* Organization facebook */
  @IsString()
  @IsOptional()
  facebook?: string;

  /* Organization instagram */
  @IsString()
  @IsOptional()
  instagram?: string;

  /* Organization twitter */
  @IsString()
  @IsOptional()
  twitter?: string;

  /* Organization linkedin */
  @IsString()
  @IsOptional()
  linkedin?: string;

  /* Organization tiktok */
  @IsString()
  @IsOptional()
  tiktok?: string;

  /* Organization donation website */
  @IsString()
  @IsOptional()
  donationWebsite?: string;

  /* Organization donation redirect link */
  @IsString()
  @IsOptional()
  redirectLink?: string;

  /* Organization donation sms number */
  @IsString()
  @IsOptional()
  donationSMS?: string;

  /* Organization donation keyword */
  @IsString()
  @IsOptional()
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
