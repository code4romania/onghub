import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { ApplicationTableView } from '../entities/application-table-view.entity';

@Injectable()
export class ApplicationTableViewRepository extends BaseDAO<ApplicationTableView> {
  constructor(
    @InjectRepository(ApplicationTableView)
    private readonly applicationViewRepository: Repository<ApplicationTableView>,
  ) {
    super(applicationViewRepository);
  }
}
