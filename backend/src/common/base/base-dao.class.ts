import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

export abstract class BaseDAO<T> {
  constructor(private readonly repository: Repository<T>) {}

  get(conditions: FindOptionsWhere<T>) {
    return this.repository.findOne(conditions);
  }

  getMany(conditions: FindOptionsWhere<T>) {
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

  update(findCriteria: FindOptionsWhere<T>, updates: T) {
    return this.repository.update(findCriteria, updates);
  }

  async saveOrUpdate(
    findCriteria: FindOptionsWhere<T>,
    updates: DeepPartial<T>,
  ) {
    const record = await this.get(findCriteria);
    return this.repository.save({ ...record, ...updates });
  }

  delete(findCriteria: FindOptionsWhere<T>) {
    return this.repository.softDelete(findCriteria);
  }
}
