import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateContactDto } from 'src/common/dto/update-contact.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';

export class UpdateOrganizationGeneralDto extends PartialType(
  OmitType(CreateOrganizationGeneralDto, ['contact']),
) {
  @IsOptional()
  @ApiProperty({
    description: 'Organization contact person',
    type: () => UpdateContactDto,
  })
  @Type(() => UpdateContactDto)
  @ValidateNested()
  contact?: UpdateContactDto;
}
