import { IsEnum } from 'class-validator';
import { OrganizationRequestFilter } from '../enums/organization-request-statistics.enum';

export class OrganizationStatisticsFilterDto {
  @IsEnum(OrganizationRequestFilter)
  organizationRequestFilter: OrganizationRequestFilter =
    OrganizationRequestFilter._30_DAYS;
}
