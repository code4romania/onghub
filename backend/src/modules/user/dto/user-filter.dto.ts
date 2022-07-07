import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
