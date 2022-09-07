import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { ApplicationTypeEnum } from 'src/modules/application/enums/ApplicationType.enum';
import { RequestStatus } from '../../organization/enums/request-status.enum';

export class ApplicationRequestFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(ApplicationTypeEnum)
  applicationType?: ApplicationTypeEnum;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}
