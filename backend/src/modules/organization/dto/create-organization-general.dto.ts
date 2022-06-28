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
  @Matches(/^[a-zA-Z-]*$/)
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
  @Min(1900)
  @Max(2022)
  @IsNumber()
  @Length(4, 4)
  yearCreated: number;

  /* Organization CUI/CIF */
  @IsString()
  @Length(2, 12)
  @Matches(/((RO)?\d+)/)
  // TODO: fix length and cif starting with lower case letters
  cui: string;

  /* Organization Register of Associations and Foundations Number */
  @IsString()
  @Length(10, 12)
  @Matches(/^[a-zA-Z0-9/]*$/)
  rafNumber: string;

  /* Organization short description */
  @IsString()
  @IsOptional()
  @Length(200, 250)
  @Matches(/^[a-zA-Z.]*$/)
  shortDescription?: string;

  /* Organization long description */
  @IsString()
  @IsOptional()
  @Length(250, 500)
  @Matches(/^[a-zA-Z.]*$/)
  description?: string;

  // TODO: this should be removed once we have the attachment table
  /* Organization logo/link */
  @IsString()
  logo: string;

  /* Organization website */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  website?: string;

  /* Organization facebook */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  facebook?: string;

  /* Organization instagram */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  instagram?: string;

  /* Organization twitter */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  twitter?: string;

  /* Organization linkedin */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  linkedin?: string;

  /* Organization tiktok */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  tiktok?: string;

  /* Organization donation website */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
  donationWebsite?: string;

  /* Organization donation redirect link */
  @IsString()
  @IsOptional()
  @Matches(/^(https?:\/\/)/)
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
