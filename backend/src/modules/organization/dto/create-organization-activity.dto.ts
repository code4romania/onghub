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
import { ToBoolean } from 'src/common/decorators/to-boolean.decorator';
import { Area } from '../enums/organization-area.enum';

export class CreateOrganizationActivityDto {
  @IsEnum(Area)
  area: Area;

  @IsBoolean()
  @ToBoolean()
  isPartOfFederation: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  federations?: number[];

  @IsBoolean()
  @ToBoolean()
  isPartOfCoalition: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  coalitions?: number[];

  @IsBoolean()
  @ToBoolean()
  isPartOfInternationalOrganization: boolean;

  @IsString()
  @IsOptional()
  @Matches(REGEX.ALPHANUMERIC)
  @Length(3, 100)
  internationalOrganizationName: string;

  @IsBoolean()
  @ToBoolean()
  isSocialServiceViable: boolean;

  @IsBoolean()
  @ToBoolean()
  offersGrants: boolean;

  @IsBoolean()
  @ToBoolean()
  isPublicIntrestOrganization: boolean;

  @IsBoolean()
  @ToBoolean()
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

  @IsArray()
  @IsOptional()
  newFederations?: string[];

  @IsArray()
  @IsOptional()
  newCoalitions?: string[];
}
