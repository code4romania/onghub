import { IsEnum } from 'class-validator';
import { OrganizationStatisticsType } from '../enums/organization-statistics-type.enum';

export class StatisticsFilterDto {
  @IsEnum(OrganizationStatisticsType)
  statisticsFilter: OrganizationStatisticsType =
    OrganizationStatisticsType.MONTHLY;
}
