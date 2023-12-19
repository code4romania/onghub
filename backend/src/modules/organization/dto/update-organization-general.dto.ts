import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';

export class UpdateOrganizationGeneralDto extends PartialType(
  CreateOrganizationGeneralDto,
) {
  @IsOptional()
  @Type(() => CreateContactDto)
  @ValidateNested()
  contact?: CreateContactDto;
}
