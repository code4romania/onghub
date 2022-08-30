import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

export class ApplicationFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(ApplicationTypeEnum)
  type?: ApplicationTypeEnum;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
