import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationReport } from '../entities';

@Injectable()
export class OrganizationReportRepository extends BaseDAO<OrganizationReport> {
  constructor(
    @InjectRepository(OrganizationReport)
    private readonly organizationReportRepository: Repository<OrganizationReport>,
  ) {
    super(organizationReportRepository);
  }
}
