import { ApiProperty } from '@nestjs/swagger';
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
export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  alias: string;

  @IsEnum(OrganizationType)
  @ApiProperty()
  type: OrganizationType;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  email: string;

  @IsNumber()
  @ApiProperty()
  yearCreated: number;

  @IsString()
  @MaxLength(12)
  @MinLength(2)
  @ApiProperty()
  cui: string;

  @IsString()
  @MaxLength(12)
  @MinLength(2)
  @ApiProperty()
  rafNumber: string;

  @IsString()
  @IsOptional()
  @MinLength(200)
  @MaxLength(250)
  @ApiProperty()
  shortDescription: string;

  @IsString()
  @IsOptional()
  @MinLength(250)
  @MaxLength(500)
  @ApiProperty()
  description: string;

  // TODO: this should be removed once we have the attachment table
  @IsString()
  @ApiProperty()
  logo: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  website: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  facebook: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  instagram: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  twitter: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  linkedin: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  tiktok: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  donationWebsite: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  redirectLink: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  donationSMS: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  donationKeyword: string;

  @Type(() => CreateContactDto)
  @ValidateNested()
  @ApiProperty()
  contact: CreateContactDto;

  @IsNumber()
  @ApiProperty()
  countyId: number;

  @IsNumber()
  @ApiProperty()
  cityId: number;
}
