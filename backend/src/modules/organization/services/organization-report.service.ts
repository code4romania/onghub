import { Injectable } from '@nestjs/common';
import { UpdateOrganizationReportDto } from '../dto/update-organization-report.dto';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationReportRepository } from '../repositories';
import { InvestorService } from './investor.service';
import { PartnerService } from './partner.service';
import { ReportService } from './report.service';

@Injectable()
export class OrganizationReportService {
  constructor(
    private readonly organizationReportRepository: OrganizationReportRepository,
    private readonly reportService: ReportService,
    private readonly partnerService: PartnerService,
    private readonly investorService: InvestorService,
  ) {}

  public async update(
    orgReportId: number,
    updateOrganizationReportDto: UpdateOrganizationReportDto,
  ) {
    if (updateOrganizationReportDto.report) {
      const { id, ...data } = updateOrganizationReportDto.report;
      const partner = await this.partnerService.get({
        where: { year: updateOrganizationReportDto.year },
      });
      console.log(partner);
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
    if (updateOrganizationReportDto.partner) {
      const { id, ...data } = updateOrganizationReportDto.partner;
      data['status'] = CompletionStatus.COMPLETED;
      if (data.numberOfPartners === null) {
        data['status'] = CompletionStatus.NOT_COMPLETED;
      }
      this.organizationReportRepository.save({ id });
      return this.partnerService.update(id, data);
    }
    if (updateOrganizationReportDto.investor) {
      const { id, ...data } = updateOrganizationReportDto.investor;
      data['status'] = CompletionStatus.COMPLETED;
      if (data.numberOfInvestors === null) {
        data['status'] = CompletionStatus.NOT_COMPLETED;
      }
      this.organizationReportRepository.save({ id });
      return this.investorService.update(id, data);
    }
  }
}
