import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationGeneral } from '../entities/organization-general.entity';

@Injectable()
export class OrganizationGeneralRepository extends BaseDAO<OrganizationGeneral> {
  constructor(
    @InjectRepository(OrganizationGeneral)
    private readonly organizationGeneralRepository: Repository<OrganizationGeneral>,
  ) {
    super(organizationGeneralRepository);
  }
}
