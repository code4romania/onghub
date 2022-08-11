import { Between, In } from 'typeorm';
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
import { IPaginationConfig } from '../interfaces/pagination-config';
import { PaginationMeta } from '../interfaces/pagination-meta';
import { BaseFilterDto } from './base-filter.dto';

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

  async updateOne(updates: DeepPartial<T>): Promise<T> {
    const record = await this.repository.preload(updates);

    if (!record) {
      throw new Error(
        `Could not find the record by ${JSON.stringify(updates)} to update!`,
      );
    }

    return this.repository.save(record);
  }

  update(
    findCriteria: FindOptionsWhere<T>,
    updates: QueryDeepPartialEntity<T>,
  ) {
    return this.repository.update(findCriteria, updates);
  }

  async saveOrUpdate(findCriteria: FindOneOptions<T>, updates: DeepPartial<T>) {
    const record = await this.get(findCriteria);
    return this.repository.save({ ...record, ...updates });
  }

  delete(findCriteria: FindOptionsWhere<T>) {
    return this.repository.softDelete(findCriteria);
  }

  remove(findCriteria: FindOptionsWhere<T>) {
    return this.repository.delete(findCriteria);
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

    // select query
    const selectQuery = this.buildQueryObject(config.selectColumns);
    // relations
    const relationsQuery = this.buildQueryObject(config.relations);
    // filters (and where)
    const orWhereQuery = [];
    const andWherQuery: any = {};

    // loop through filters
    for (const filter in filters) {
      andWherQuery[filter] =
        typeof filters[filter] === 'object' && Array.isArray(filters[filter])
          ? In(filters[filter])
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
      select: selectQuery,
      relations: relationsQuery,
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

  private buildQueryObject = (options: string[]): any => {
    return options.reduce((prev: any, curr: string) => {
      const currentBlock = curr.split('.');
      return currentBlock.length === 1
        ? { ...prev, [curr]: true }
        : {
            ...prev,
            [currentBlock[0]]: this.buildQueryObject([currentBlock[1]]),
          };
    }, {});
  };

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

  private betweenDates = (from: Date | string, to: Date | string) =>
    Between(
      format(
        typeof from === 'string' ? new Date(from) : from,
        'YYYY-MM-DD HH:MM:SS',
      ),
      format(typeof to === 'string' ? new Date(to) : to, 'YYYY-MM-DD HH:MM:SS'),
    );
}
