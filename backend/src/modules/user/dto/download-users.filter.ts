import { IsString, IsOptional, IsDate, IsEnum, IsArray } from 'class-validator';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { UserStatus } from '../enums/user-status.enum';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';

export class DownloadFiltersDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsArray()
  @IsOptional()
  availableAppsIDs?: number[];
}
