import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { OrganizationRequest } from '../entities/organization-request.entity';

@Injectable()
export class OrganizationRequestRepository extends BaseDAO<OrganizationRequest> {
  constructor(
    @InjectRepository(OrganizationRequest)
    private readonly organizationRequestRepository: Repository<OrganizationRequest>,
  ) {
    super(organizationRequestRepository);
  }
}
