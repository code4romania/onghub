import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationView } from '../entities/organization-view.entity';

@Injectable()
export class OrganizationViewRepository extends BaseDAO<OrganizationView> {
  constructor(
    @InjectRepository(OrganizationView)
    private readonly organizationViewRepository: Repository<OrganizationView>,
  ) {
    super(organizationViewRepository);
  }
}
