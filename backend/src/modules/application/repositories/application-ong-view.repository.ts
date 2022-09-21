import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { ApplicationOngView } from '../entities/application-ong-view.entity';

@Injectable()
export class ApplicationOngViewRepository extends BaseDAO<ApplicationOngView> {
  constructor(
    @InjectRepository(ApplicationOngView)
    private readonly applicationOngViewRepository: Repository<ApplicationOngView>,
  ) {
    super(applicationOngViewRepository);
  }
}
