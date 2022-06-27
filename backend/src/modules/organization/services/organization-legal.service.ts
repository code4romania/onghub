import { Injectable } from '@nestjs/common';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationLegalRepository } from '../repositories';

@Injectable()
export class OrganizationLegalService {
  constructor(
    private readonly organizationLegalRepostory: OrganizationLegalRepository,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
  ) {
    return this.organizationLegalRepostory.save({
      id,
      ...updateOrganizationLegalDto,
    });
  }
}
