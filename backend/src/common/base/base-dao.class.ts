import { Between, FindOperator } from 'typeorm';
import { format } from 'date-fns';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { OrderDirection } from '../enums/order-direction.enum';
import {
  FilterOperator,
  IPaginationConfig,
} from '../interfaces/pagination-config';
import { PaginationMeta } from '../interfaces/pagination-meta';
import { BaseFilterDto } from './base-filter.dto';
import { OperatorSymbolToFunction } from '../helpers/operator-to-function.map';

export abstract class BaseDAO<T> {
  constructor(private readonly repository: Repository<T>) {}

  get(conditions: FindOneOptions<T>) {
    return this.repository.findOne(conditions);
  }

  getMany(conditions: FindManyOptions<T>) {
    return this.repository.find(conditions);
  }

  save(entityLike: DeepPartial<T>): Promise<T> {
    const record = this.repository.create(entityLike);
    return this.repository.save(record);
  }

  saveMany(entitiesLike: DeepPartial<T>[]): Promise<T[]> {
    const records = this.repository.create(entitiesLike);
    return this.repository.save(records);
  }

  async updateOne(updates: DeepPartial<T>): Promise<T> {
    const record = await this.repository.preload(updates);

    if (!record) {
      throw new Error(
        `Could not find the record by ${JSON.stringify(updates)} to update!`,
      );
    }

    return this.repository.save(record);
  }

  async update(
    findCriteria: FindOptionsWhere<T>,
    updates: QueryDeepPartialEntity<T>,
  ) {
    const record = await this.get({ where: findCriteria });

    if (!record) {
      throw new Error(
        `Could not find the record by ${JSON.stringify(
          findCriteria,
        )} to update with  ${JSON.stringify(updates)}!`,
      );
    }

    return this.repository.save({ ...record, ...updates });
  }

  delete(findCriteria: FindOptionsWhere<T>) {
    return this.repository.softDelete(findCriteria);
  }

  async remove(findCriteria: FindManyOptions<T>) {
    const records = await this.getMany(findCriteria);

    if (records.length === 0) {
      throw new Error(
        `Could not find the records by ${JSON.stringify(findCriteria)}`,
      );
    }

    return this.repository.remove(records);
  }

  count(findCriteria?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(findCriteria);
  }

  public async getManyPaginated(
    config: IPaginationConfig,
    options: BaseFilterDto,
  ): Promise<{ items: T[]; meta: PaginationMeta }> {
    const {
      limit,
      page,
      search,
      orderBy,
      orderDirection,
      start,
      end,
      ...filters
    } = options;

    // filters (and where)
    const orWhereQuery = [];
    const andWherQuery: any = {};

    // loop through filters
    for (const filter in filters) {
      andWherQuery[filter] =
        typeof filters[filter] === 'string'
          ? this.applyFilter(filters[filter])
          : filters[filter];
    }

    // handle range
    if (config.rangeColumn && start && end) {
      andWherQuery[config.rangeColumn] = this.betweenDates(start, end);
    }

    // search query
    if (search) {
      const where = config.searchableColumns.map((column: string) => ({
        ...andWherQuery,
        ...this.buildSearchQuery(column, search),
      }));
      orWhereQuery.push(...where);
    } else {
      if (Object.keys(andWherQuery).length > 0) orWhereQuery.push(andWherQuery);
    }

    // order conditions
    const orderOptions: FindOptionsOrder<any> = {
      [options.orderBy || config.defaultSortBy]:
        options.orderDirection || OrderDirection.ASC,
    };

    // full query
    let query: FindManyOptions<T> = {
      select: config.selectColumns,
      relations: config.relations,
      order: orderOptions,
      take: limit,
      skip: (page - 1) * limit,
    };

    if (orWhereQuery.length > 0) {
      query = {
        ...query,
        where: orWhereQuery,
      };
    }

    // [T[], totalItems]
    const response = await this.repository.findAndCount(query);

    // query items + the pagination meta
    return {
      items: response[0],
      meta: {
        itemCount: response[0].length,
        totalItems: response[1],
        itemsPerPage: limit,
        totalPages: Math.ceil(response[1] / limit),
        currentPage: page,
      },
    };
  }

  private buildSearchQuery = (option: string, search: string): any => {
    const optionValues = option.split('.');
    return optionValues.length === 1
      ? { [option]: ILike(`%${search}%`) }
      : {
          [optionValues[0]]: this.buildSearchQuery(
            optionValues.slice(1).join('.'),
            search,
          ),
        };
  };

  private applyFilter = (
    filterValue: string,
  ): string | FindOperator<string> => {
    const [operator, ...values] = filterValue.split(':');

    if (!Object.values(FilterOperator).includes(operator as FilterOperator)) {
      return filterValue;
    }

    // map the correct method
    switch (operator) {
      case FilterOperator.BTW:
        return OperatorSymbolToFunction.get(operator as FilterOperator)(
          ...filterValue.substring(operator.length + 1).split(','),
        );
      case FilterOperator.IN:
        return OperatorSymbolToFunction.get(operator as FilterOperator)(
          filterValue.substring(operator.length + 1).split(','),
        );
      default:
        return OperatorSymbolToFunction.get(operator as FilterOperator)(
          filterValue.substring(operator.length + 1),
        );
    }
  };

  private betweenDates = (from: Date | string, to: Date | string) =>
    Between(
      format(
        typeof from === 'string' ? new Date(from) : from,
        'yyyy-MM-dd HH:MM:SS',
      ),
      format(typeof to === 'string' ? new Date(to) : to, 'yyyy-MM-dd HH:MM:SS'),
    );
}
