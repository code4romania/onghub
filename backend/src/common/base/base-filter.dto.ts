import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderDirection } from '../enums/order-direction.enum';

export class BaseFilterDto {
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
