import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationStatusStatisticsView } from '../entities/organization-status-statistics-view.entity';

@Injectable()
export class OrganizatioStatusnStatisticsViewRepository extends BaseDAO<OrganizationStatusStatisticsView> {
  constructor(
    @InjectRepository(OrganizationStatusStatisticsView)
    private readonly organizationStatisticsViewRepository: Repository<OrganizationStatusStatisticsView>,
  ) {
    super(organizationStatisticsViewRepository);
  }
}
