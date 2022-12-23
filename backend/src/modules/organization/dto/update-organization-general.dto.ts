import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';
import { UpdateContactDto } from './update-contact.dto';

export class UpdateOrganizationGeneralDto extends PartialType(
  CreateOrganizationGeneralDto,
) {
  @Type(() => UpdateContactDto)
  @ValidateNested()
  contact?: UpdateContactDto;
}
