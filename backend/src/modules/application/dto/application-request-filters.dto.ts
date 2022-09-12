import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { RequestStatus } from '../../organization/enums/request-status.enum';

export class ApplicationRequestFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}
