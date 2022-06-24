import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationActivityDto } from './create-organization-activity.dto';

export class UpdateOrganizationActivityDto extends PartialType(
  CreateOrganizationActivityDto,
) {}
