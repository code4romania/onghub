import { PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateContactDto } from 'src/modules/organization/dto/update-contact.dto';
import { CreateOrganizationLegalDto } from './create-organization-legal.dto';
import { UpsertContactDto } from './upsert-contact.dto';

export class UpdateOrganizationLegalDto extends PartialType(
  OmitType(CreateOrganizationLegalDto, ['directors', 'legalReprezentative']),
) {
  /* Organization legal representative */
  @IsOptional()
  @Type(() => UpdateContactDto)
  @ValidateNested()
  legalReprezentative?: UpdateContactDto;

  /* Organization directors */
  @IsOptional()
  @Type(() => UpsertContactDto)
  @ValidateNested()
  directors?: UpsertContactDto[];
}
