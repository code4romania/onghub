import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { ApplicationView } from '../entities/application-view.entity';

@Injectable()
export class ApplicationViewRepository extends BaseDAO<ApplicationView> {
  constructor(
    @InjectRepository(ApplicationView)
    private readonly applicationViewRepository: Repository<ApplicationView>,
  ) {
    super(applicationViewRepository);
  }
}
