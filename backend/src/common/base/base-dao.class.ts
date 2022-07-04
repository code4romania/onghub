import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { OrderDirection } from '../enums/order-direction.enum';
import { IPaginationConfig } from '../interfaces/pagination-config';
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

  public async getManyPaginated(
    config: IPaginationConfig,
    options: BaseFilterDto,
  ): Promise<Pagination<T>> {
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

    const query = this.repository
      .createQueryBuilder('e')
      .select(config.selectColumns.length > 0 ? config.selectColumns : ['e.*']);

    // handle complex queries
    for (const relation of config.relations) {
      query.leftJoinAndSelect(`e.${relation}`, relation);
    }

    // handle search
    if (search) {
      const searchQuery = config.searchableColumns
        .map((column) => `${column} ILIKE '%${search}%'`)
        .join(' OR ');

      query.andWhere(searchQuery);
    }

    // handle range
    if (config.rangeColumn && start && end) {
      query.andWhere(
        `e.${config.rangeColumn} >= to_timestamp('${new Date(
          start,
        ).toISOString()}', 'YYYY-MM-DDThh24:mi:ss') AND e.${
          config.rangeColumn
        } < to_timestamp('${new Date(
          end,
        ).toISOString()}', 'YYYY-MM-DDThh24:mi:ss')`,
      );
    }

    // loop through filters
    for (const filter in filters) {
      query.andWhere(`e.${filter}='${filters[filter]}'`);
    }

    // handle sort
    if (options.orderBy) {
      query.addOrderBy(
        options.orderBy,
        options.orderDirection || OrderDirection.ASC,
      );
    }

    return paginateRaw(query, { limit, page });
  }
}
