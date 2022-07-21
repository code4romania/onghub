import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { Area } from '../enums/organization-area.enum';

export class CreateOrganizationActivityDto {
  @IsEnum(Area)
  area: Area;

  @IsBoolean()
  isPartOfFederation: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  federations?: number[];

  @IsBoolean()
  isPartOfCoalition: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  coalitions?: number[];

  @IsBoolean()
  isPartOfInternationalOrganization: boolean;

  @IsString()
  @IsOptional()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  internationalOrganizationName: string;

  @IsBoolean()
  isSocialServiceViable: boolean;

  @IsBoolean()
  offersGrants: boolean;

  @IsBoolean()
  isPublicIntrestOrganization: boolean;

  @IsBoolean()
  hasBranches: boolean;

  @IsOptional()
  @ArrayNotEmpty()
  @IsArray()
  branches?: number[];

  @IsArray()
  @ArrayNotEmpty()
  domains: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  regions?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  cities?: number[];
}
