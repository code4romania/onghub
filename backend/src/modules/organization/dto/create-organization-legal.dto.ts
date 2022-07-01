import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Person } from 'src/modules/organization/dto/person.dto';
import { CreateContactDto } from 'src/modules/organization/dto/create-contact.dto';
import { REGEX } from 'src/common/constants/patterns.constant';

export class CreateOrganizationLegalDto {
  /* Organization legal representative */
  @Type(() => CreateContactDto)
  @ValidateNested()
  legalReprezentative: CreateContactDto;

  /* Organization directors */
  @Type(() => CreateContactDto)
  @ValidateNested()
  directors: CreateContactDto[];

  /* Other relevant persons in organization */
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Person)
  others?: Person[];

  /* 
  Organization statute link
  @example "http://www.google.com"
  */
  @IsOptional()
  @IsString()
  @Matches(REGEX.LINK)
  organizationStatute?: string;
}
