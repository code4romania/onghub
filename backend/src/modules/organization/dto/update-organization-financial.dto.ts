import { PartialType, OmitType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateOrganizationFinancialDto } from './create-organization-financial.dto';

export class UpdateOrganizationFinancialDto extends PartialType(
  OmitType(CreateOrganizationFinancialDto, ['type']),
) {
  @IsNumber()
  @IsOptional()
  organizationFinancialId: number;
}
