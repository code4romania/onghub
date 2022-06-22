import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';
export class CreateOrganizationDto {
  @Type(() => CreateOrganizationGeneralDto)
  @ValidateNested()
  general: CreateOrganizationGeneralDto;
}
