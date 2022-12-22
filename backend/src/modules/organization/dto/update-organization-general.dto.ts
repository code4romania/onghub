import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateOrganizationGeneralDto } from './create-organization-general.dto';

export class UpdateOrganizationGeneralDto extends PartialType(
  OmitType(CreateOrganizationGeneralDto, ['contact']),
) {}
