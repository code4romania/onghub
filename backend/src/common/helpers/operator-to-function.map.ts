import {
  FindOperator,
  Equal,
  MoreThan,
  MoreThanOrEqual,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Between,
  Not,
} from 'typeorm';
import { FilterOperator } from '../interfaces/pagination-config';

export const OperatorSymbolToFunction = new Map<
  FilterOperator,
  (...args: any[]) => FindOperator<string>
>([
  [FilterOperator.EQ, Equal],
  [FilterOperator.GT, MoreThan],
  [FilterOperator.GTE, MoreThanOrEqual],
  [FilterOperator.IN, In],
  [FilterOperator.NULL, IsNull],
  [FilterOperator.LT, LessThan],
  [FilterOperator.LTE, LessThanOrEqual],
  [FilterOperator.BTW, Between],
  [FilterOperator.NOT, Not],
]);
