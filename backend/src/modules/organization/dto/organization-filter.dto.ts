import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OrganizationStatus } from '../enums/organization-status.enum';

export class OrganizationFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(OrganizationStatus)
  status?: OrganizationStatus;
}
