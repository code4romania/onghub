import { Injectable } from '@nestjs/common';
import { UpdateOrganizationReportDto } from '../dto/update-organization-report.dto';
import { InvestorService } from './investor.service';
import { PartnerService } from './partner.service';
import { ReportService } from './report.service';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationReportRepository } from '../repositories';

@Injectable()
export class OrganizationReportService {
  constructor(
    private readonly organizationReportRepository: OrganizationReportRepository,
    private readonly reportService: ReportService,
    private readonly partnerService: PartnerService,
    private readonly investorService: InvestorService,
  ) {}

  public async update(
    updateOrganizationReportDto: UpdateOrganizationReportDto,
  ) {
    if (updateOrganizationReportDto.report) {
      const { id, ...data } = updateOrganizationReportDto.report;
      const partner = await this.partnerService.get({
        where: { year: updateOrganizationReportDto.year },
      });
      const investor = await this.investorService.get({
        where: { year: updateOrganizationReportDto.year },
      });
      data['status'] = CompletionStatus.COMPLETED;
      if (
        data.numberOfContractors !== investor.numberOfInvestors ||
        data.numberOfVolunteers !== partner.numberOfPartners
      ) {
        data['status'] = CompletionStatus.NOT_COMPLETED;
      }
      this.organizationReportRepository.save({ id });
      return this.reportService.update(id, data);
    }
  }

  public async delete(reportId: number, partnerId: number, investorId: number) {
    if (investorId) {
      this.investorService.delete(investorId);
    }

    if (partnerId) {
      this.partnerService.delete(partnerId);
    }

    if (reportId) {
      this.reportService.delete(reportId);
    }
  }
}
