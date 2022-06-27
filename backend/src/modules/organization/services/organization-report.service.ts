import { Injectable } from '@nestjs/common';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { UpdateOrganizationReportDto } from '../dto/update-organization-report.dto';
import { OrganizationReportRepository } from '../repositories';

@Injectable()
export class OrganizationReportService {
  constructor(
    private readonly organizationReportRepostory: OrganizationReportRepository,
  ) {}

  public async update(
    id: number,
    updateOrganizationReportDto: UpdateOrganizationReportDto,
  ) {
    return this.organizationReportRepostory.save({
      id,
      ...updateOrganizationReportDto,
    });
  }
}
