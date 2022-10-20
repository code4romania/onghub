import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinDate,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsValidPhone } from 'src/common/decorators/validation.decorator';
import { AgeCategory } from '../enums/age-category.enum';

export class CreateCivicCenterServiceDto {
  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 50)
  name: string;

  @IsNumber()
  locationId: number;

  @IsDate()
  @MinDate(new Date())
  startDate: Date;

  @IsDate()
  @IsOptional()
  @MinDate(new Date())
  endDate?: Date;

  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 250)
  shortDescription: string;

  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 3000)
  longDescription: string;

  @IsArray()
  @ArrayNotEmpty()
  domains: number[];

  @IsEnum(AgeCategory)
  ageCategory: AgeCategory;

  @IsBoolean()
  hasOnlineAccess: boolean;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  onlineAccessLink: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 1000)
  onlineAccessDescription: string;

  @IsBoolean()
  hasEmailPhoneAccess: boolean;

  @IsEmail()
  @IsOptional()
  @MaxLength(50)
  emailAccess: string;

  @IsString()
  @IsOptional()
  @IsValidPhone()
  phoneAccess: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 1000)
  emailPhoneAccessDescription: string;

  @IsBoolean()
  hasPhysicalAccess: boolean;

  @IsString()
  @IsOptional()
  @Length(3, 300)
  physicalAccessAddress: string;

  @IsString()
  @IsOptional()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 1000)
  physicalAccessDescription: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsNumber()
  organizationId: number;
}
