import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateContactDto } from 'src/shared/dto/update-contact.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';

export class UpdateOrganizationGeneralDto extends PartialType(
  OmitType(CreateOrganizationGeneralDto, ['contact']),
) {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Organization contact person',
    type: () => UpdateContactDto,
  })
  @Type(() => UpdateContactDto)
  @ValidateNested()
  contact?: UpdateContactDto;
}
