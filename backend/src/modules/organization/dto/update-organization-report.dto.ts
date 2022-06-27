import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationReportDto } from './create-organization-report.dto';

export class UpdateOrganizationReportDto extends PartialType(
  CreateOrganizationReportDto,
) {}
