import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationFinancial } from '../entities/organization-financial.entity';

@Injectable()
export class OrganizationFinancialRepository extends BaseDAO<OrganizationFinancial> {
  constructor(
    @InjectRepository(OrganizationFinancial)
    private readonly organizationFinancialRepository: Repository<OrganizationFinancial>,
  ) {
    super(organizationFinancialRepository);
  }
}
