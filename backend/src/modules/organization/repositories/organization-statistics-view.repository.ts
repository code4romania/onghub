import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationStatisticsView } from '../entities/organization-statistics-view.entity';

@Injectable()
export class OrganizationStatisticsViewRepository extends BaseDAO<OrganizationStatisticsView> {
  constructor(
    @InjectRepository(OrganizationStatisticsView)
    private readonly organizationStatisticsViewRepository: Repository<OrganizationStatisticsView>,
  ) {
    super(organizationStatisticsViewRepository);
  }
}
