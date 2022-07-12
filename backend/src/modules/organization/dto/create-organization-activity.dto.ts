import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Area } from '../enums/organization-area.enum';

export class CreateOrganizationActivityDto {
  @IsEnum(Area)
  area: Area;

  @IsBoolean()
  isPartOfFederation: boolean;

  @IsArray()
  @IsOptional()
  federations?: number[];

  @IsBoolean()
  isPartOfCoalition: boolean;

  @IsArray()
  @IsOptional()
  coalitions?: number[];

  @IsBoolean()
  isPartOfInternationalOrganization: boolean;

  @IsString()
  @IsNotEmpty()
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
  @IsArray()
  branches?: number[];

  @IsArray()
  domains: number[];

  @IsArray()
  @IsOptional()
  regions?: number[];

  @IsArray()
  @IsOptional()
  cities?: number[];
}
