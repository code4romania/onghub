import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

export class OrganizationFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(CompletionStatus)
  completionStatus?: CompletionStatus;

  @IsOptional()
  userCount?: string;
}
