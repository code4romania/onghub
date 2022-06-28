import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateOrganizationActivityDto {
  @IsBoolean()
  isPartOfFederation: boolean;

  @IsArray()
  @Length(3, 100, { each: true })
  @Matches(/^[a-zA-Z-]*$/, { each: true })
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

  @IsNumber()
  areaId: number;

  @IsArray()
  domains: number[];

  @IsArray()
  cities: number[];
}
