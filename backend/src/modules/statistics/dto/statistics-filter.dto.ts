import { IsEnum } from 'class-validator';
import { OrganizationRequestFilter } from '../../organization/enums/organization-request-statistics.enum';

export class StatisticsFilterDto {
  @IsEnum(OrganizationRequestFilter)
  statisticsFilter: OrganizationRequestFilter =
    OrganizationRequestFilter._30_DAYS;
}
