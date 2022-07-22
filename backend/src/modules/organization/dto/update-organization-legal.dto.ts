import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { UpdateContactDto } from 'src/modules/organization/dto/update-contact.dto';
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
}
