import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
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

  /* 
  
  @example ["Google", "Google-Google", "Google Google"] 
  */
  @IsArray()
  @Length(3, 100, { each: true })
  @Matches(REGEX.NAME, { each: true })
  federations: string[];

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
