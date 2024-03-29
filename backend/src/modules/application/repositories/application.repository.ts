import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Application } from '../entities/application.entity';

@Injectable()
export class ApplicationRepository extends BaseDAO<Application> {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {
    super(applicationRepository);
  }

  public getQueryBuilder(): SelectQueryBuilder<Application> {
    return this.applicationRepository.createQueryBuilder('application');
  }
}
