import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsBoolean()
  isPartOfFederation: boolean;

  @ApiProperty()
  @IsArray()
  federations: string[];

  @ApiProperty()
  @IsBoolean()
  isPartOfInternationalOrganization: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  internationalOrganizationName: string;

  @ApiProperty()
  @IsBoolean()
  isSocialServiceViable: boolean;

  @ApiProperty()
  @IsBoolean()
  offersGrants: boolean;

  @ApiProperty()
  @IsBoolean()
  isPublicIntrestOrganization: boolean;

  @ApiProperty()
  @IsBoolean()
  hasBranches: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsArray()
  branches?: number[];

  @ApiProperty()
  @IsNumber()
  areaId: number;

  @ApiProperty()
  @IsNumber()
  @IsArray()
  domains: number[];

  @ApiProperty()
  @IsNumber()
  @IsArray()
  cities: number[];
}
