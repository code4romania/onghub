import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Person } from 'src/modules/organization/dto/person.dto';
import { CreateContactDto } from 'src/modules/organization/dto/create-contact.dto';

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
}
