import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { REGEX } from 'src/common/constants/patterns.constant';
import { UpdateContactDto } from 'src/modules/organization/dto/update-contact.dto';
import { Person } from './person.dto';
import { UpsertContactDto } from './upsert-contact.dto';

export class UpdateOrganizationLegalDto {
  @IsOptional()
  @Type(() => UpdateContactDto)
  @ValidateNested()
  legalReprezentative?: UpdateContactDto;

  @IsOptional()
  @Type(() => UpsertContactDto)
  @ValidateNested()
  directors: UpsertContactDto[];

  @IsOptional()
  @IsArray()
  directorsDeleted: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Person)
  others?: Person[];

  @IsOptional()
  @IsString()
  @Matches(REGEX.LINK)
  organizationStatute?: string;
}
