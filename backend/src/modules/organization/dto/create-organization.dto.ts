import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { CreateContactDto } from './create-contact.dto';
import { CreateOrganizationActivityDto } from './create-organization-activity.dto';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';
import { CreateOrganizationLegalDto } from './create-organization-legal.dto';
export class CreateOrganizationDto {
  /* Organization General */
  @Type(() => CreateUserDto)
  @ValidateNested()
  contact: CreateUserDto;
  /* Organization General */
  @Type(() => CreateOrganizationGeneralDto)
  @ValidateNested()
  general: CreateOrganizationGeneralDto;

  /* Organization Activity */
  @Type(() => CreateOrganizationActivityDto)
  @ValidateNested()
  activity: CreateOrganizationActivityDto;

  /* Organization Legal */
  @Type(() => CreateOrganizationLegalDto)
  @ValidateNested()
  legal: CreateOrganizationLegalDto;
}
