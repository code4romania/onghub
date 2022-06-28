import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOrganizationActivityDto {
  @IsBoolean()
  isPartOfFederation: boolean;

  @IsArray()
  federations: string[];

  @IsBoolean()
  isPartOfInternationalOrganization: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
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
  @IsNumber()
  @IsArray()
  branches?: number[];

  @IsNumber()
  areaId: number;

  @IsArray()
  domains: number[];

  @IsArray()
  cities: number[];
}
