import { IsNumber, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';

export class OrganizationFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsNumber()
  completionStatusCount?: number;

  @IsOptional()
  userCount?: string;
}
