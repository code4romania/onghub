import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { CreateContactDto } from 'src/shared/dto/create-contact.dto';
import { OrganizationType } from '../enums/organization-type.enum';
export class CreateOrganizationGeneralDto {
  @ApiProperty({
    description: 'Organization name',
    maxLength: 100,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Organization alias',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  alias: string;

  @ApiProperty({
    description: 'Organization type',
    enum: OrganizationType,
    enumName: 'OrganizationType',
  })
  @IsEnum(OrganizationType)
  type: OrganizationType;

  @ApiProperty({
    description: 'Organization email',
    maxLength: 50,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'Organization year created',
    minimum: 1900,
    maximum: 2022,
  })
  @Min(1900)
  @Max(2022)
  @IsNumber()
  yearCreated: number;

  @ApiProperty({
    description: 'Organization CUI/CIF',
    maxLength: 12,
    minLength: 2,
  })
  @IsString()
  @MaxLength(12)
  @MinLength(2)
  cui: string;

  @ApiProperty({
    description: 'Organization Register of Associations and Foundations Number',
    maxLength: 12,
    minLength: 2,
  })
  @IsString()
  @MaxLength(12)
  @MinLength(2)
  rafNumber: string;

  @ApiPropertyOptional({
    description: 'Organization short description',
    maxLength: 250,
    minLength: 200,
  })
  @IsString()
  @IsOptional()
  @MinLength(200)
  @MaxLength(250)
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Organization long description',
    maxLength: 300,
    minLength: 250,
  })
  @IsString()
  @IsOptional()
  @MinLength(250)
  @MaxLength(500)
  description?: string;

  // TODO: this should be removed once we have the attachment table
  @ApiProperty({
    description: 'Organization logo/link',
  })
  @IsString()
  logo: string;

  @ApiPropertyOptional({
    description: 'Organization website',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    description: 'Organization facbook',
  })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({
    description: 'Organization instagram',
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({
    description: 'Organization twitter',
  })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Organization linkedin',
  })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({
    description: 'Organization tiktok',
  })
  @IsString()
  @IsOptional()
  tiktok?: string;

  @ApiPropertyOptional({
    description: 'Organization donation website',
  })
  @IsString()
  @IsOptional()
  donationWebsite?: string;

  @ApiPropertyOptional({
    description: 'Organization donation redirect link',
  })
  @IsString()
  @IsOptional()
  redirectLink?: string;

  @ApiPropertyOptional({
    description: 'Organization donation sms number',
  })
  @IsString()
  @IsOptional()
  donationSMS: string;

  @ApiPropertyOptional({
    description: 'Organization donation keyword',
  })
  @IsString()
  @IsOptional()
  donationKeyword: string;

  @ApiProperty({
    description: 'Organization contact person',
    type: () => CreateContactDto,
  })
  @Type(() => CreateContactDto)
  @ValidateNested()
  contact: CreateContactDto;

  @ApiProperty({
    description: 'Organization county id',
  })
  @IsNumber()
  countyId: number;

  @ApiProperty({
    description: 'Organization city id',
  })
  @IsNumber()
  cityId: number;
}
