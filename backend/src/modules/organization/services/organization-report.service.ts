import { Injectable } from '@nestjs/common';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationReportRepository } from '../repositories';

@Injectable()
export class OrganizationReportService {
  constructor(
    private readonly organizationReportRepostory: OrganizationReportRepository,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
  ) {
    return this.organizationReportRepostory.save({
      id,
      ...updateOrganizationLegalDto,
    });
  }
}
