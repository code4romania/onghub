import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';

export class ApplicationOrganizationFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(OngApplicationStatus)
  status?: OngApplicationStatus;
}
