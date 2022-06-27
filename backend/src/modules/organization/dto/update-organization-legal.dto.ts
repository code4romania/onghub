import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateContactDto } from 'src/modules/organization/dto/update-contact.dto';
import { CreateOrganizationLegalDto } from './create-organization-legal.dto';
import { UpsertContactDto } from './upsert-contact.dto';

export class UpdateOrganizationLegalDto extends PartialType(
  OmitType(CreateOrganizationLegalDto, ['directors', 'legalReprezentative']),
) {
  @ApiPropertyOptional({
    description: 'Organization legal representative',
    type: () => UpdateContactDto,
  })
  @IsOptional()
  @Type(() => UpdateContactDto)
  @ValidateNested()
  legalReprezentative?: UpdateContactDto;

  @ApiPropertyOptional({
    description: 'Organization directors',
    type: () => [UpdateContactDto],
  })
  @IsOptional()
  @Type(() => UpsertContactDto)
  @ValidateNested()
  directors: UpsertContactDto[];
}
