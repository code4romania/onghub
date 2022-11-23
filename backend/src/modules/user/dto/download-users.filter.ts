import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { UserStatus } from '../enums/user-status.enum';

export class DownloadFiltersDto {
  @IsOptional()
  @IsNumber()
  limit?: number = 0;

  @IsOptional()
  @IsNumber()
  page?: number = 0;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsDate()
  start?: Date;

  @IsOptional()
  @IsDate()
  end?: Date;

  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
