import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationActivity } from '../entities';

@Injectable()
export class OrganizationActivityRepository extends BaseDAO<OrganizationActivity> {
  constructor(
    @InjectRepository(OrganizationActivity)
    private readonly organizationActivityRepository: Repository<OrganizationActivity>,
  ) {
    super(organizationActivityRepository);
  }
}
