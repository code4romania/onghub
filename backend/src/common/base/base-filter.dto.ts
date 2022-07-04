import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { OrderDirection } from '../enums/order-direction.enum';

export class BaseFilterDto implements IPaginationOptions {
  @IsNumber()
  limit: number = 10;

  @IsNumber()
  page: number = 1;

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
}
