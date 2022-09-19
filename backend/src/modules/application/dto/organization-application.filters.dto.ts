import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';
import { OrganizationApplicationFilter } from '../enums/organization-application-filter.enum';

export class OrganizationApplicationFilterDto {
  @IsOptional()
  @IsEnum(OrganizationApplicationFilter)
  filter?: OrganizationApplicationFilter;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
