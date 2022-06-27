import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationFinancialDto } from './create-organization-financial.dto';

export class UpdateOrganizationFinancialDto extends PartialType(
  CreateOrganizationFinancialDto,
) {}
