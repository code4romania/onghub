import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationLegal } from '../entities';

@Injectable()
export class OrganizationLegalRepository extends BaseDAO<OrganizationLegal> {
  constructor(
    @InjectRepository(OrganizationLegal)
    private readonly organizationLegalRepository: Repository<OrganizationLegal>,
  ) {
    super(organizationLegalRepository);
  }
}
