import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { IsPhoneValid } from 'src/common/decorators/is-phone-valid.decorator';
import { ToRoPhoneNumber } from 'src/common/decorators/to-ro-phone-number.decorator';

export class CreateCivicCenterServiceDto {
  @IsString()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 50)
  name: string;

  @IsNumber()
  locationId: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  isPeriodNotDetermined: boolean;

  @IsString()
  @Length(3, 250)
  shortDescription: string;

  @IsString()
  @Length(3, 3000)
  longDescription: string;

  @IsArray()
  @ArrayNotEmpty()
  domains: number[];

  @IsArray()
  beneficiaries: number[];

  @IsBoolean()
  hasOnlineAccess: boolean;

  @IsString()
  @IsOptional()
  @Matches(REGEX.LINK)
  onlineAccessLink?: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  onlineAccessDescription?: string;

  @IsBoolean()
  hasEmailPhoneAccess: boolean;

  @IsEmail()
  @IsOptional()
  @MaxLength(50)
  emailAccess?: string;

  @IsString()
  @IsOptional()
  @IsPhoneValid()
  @ToRoPhoneNumber()
  phoneAccess?: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  emailPhoneAccessDescription?: string;

  @IsBoolean()
  hasPhysicalAccess: boolean;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  physicalAccessAddress?: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  physicalAccessDescription?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsNumber()
  @IsOptional()
  organizationId?: number;
}
