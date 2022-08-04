import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationReportDto } from '../dto/update-organization-report.dto';
import { ReportService } from './report.service';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import {
  ORGANIZATION_ERRORS,
  PARTNER_ERRORS,
  INVESTOR_ERRORS,
} from '../constants/errors.constants';
import {
  InvestorRepository,
  OrganizationReportRepository,
  PartnerRepository,
} from '../repositories';
import { OrganizationReport } from '../entities';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import {
  INVESTOR_LIST,
  ORGANIZATION_FILES_DIR,
  PARTNER_LIST,
} from '../constants/files.constants';

@Injectable()
export class OrganizationReportService {
  constructor(
    private readonly organizationReportRepository: OrganizationReportRepository,
    private readonly partnerRepository: PartnerRepository,
    private readonly investorRepository: InvestorRepository,
    private readonly reportService: ReportService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  public async findOne(id: number): Promise<OrganizationReport> {
    return this.organizationReportRepository.get({
      where: { id },
      relations: ['reports', 'partners', 'investors'],
    });
  }

  public async update(
    id: number,
    updateOrganizationReportDto: UpdateOrganizationReportDto,
  ): Promise<OrganizationReport> {
    const { reportId, numberOfContractors, numberOfVolunteers, report } =
      updateOrganizationReportDto;
    const reportSummary = await this.reportService.get({
      where: { id: reportId },
    });

    if (!reportSummary) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET_REPORT,
      });
    }

    await this.reportService.update(reportId, {
      status: report
        ? CompletionStatus.COMPLETED
        : CompletionStatus.NOT_COMPLETED,
      numberOfContractors: numberOfContractors ?? null,
      numberOfVolunteers: numberOfVolunteers ?? null,
      report: report || null,
    });

    return this.findOne(id);
  }

  public async updatePartner(
    partnerId: number,
    numberOfPartners: number,
    organizationId: number,
    files: Express.Multer.File[],
  ): Promise<void> {
    const partner = await this.partnerRepository.get({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException({
        ...PARTNER_ERRORS.GET,
      });
    }

    if (partner.path) {
      await this.fileManagerService.deleteFiles([partner.path]);
    }

    const uploadedFile = await this.fileManagerService.uploadFiles(
      `${organizationId}/${ORGANIZATION_FILES_DIR.PARTNERS}`,
      files,
      `${partner.year}_${PARTNER_LIST}`,
    );

    await this.partnerRepository.save({
      ...partner,
      path: uploadedFile[0],
      numberOfPartners,
      status: CompletionStatus.COMPLETED,
    });
  }

  public async updateInvestor(
    investorId: number,
    numberOfInvestors: number,
    organizationId: number,
    files: Express.Multer.File[],
  ): Promise<void> {
    const investor = await this.investorRepository.get({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException({
        ...INVESTOR_ERRORS.GET,
      });
    }

    if (investor.path) {
      await this.fileManagerService.deleteFiles([investor.path]);
    }

    const uploadedFile = await this.fileManagerService.uploadFiles(
      `${organizationId}/${ORGANIZATION_FILES_DIR.INVESTORS}`,
      files,
      `${investor.year}_${INVESTOR_LIST}`,
    );

    await this.investorRepository.save({
      ...investor,
      path: uploadedFile[0],
      numberOfInvestors,
      status: CompletionStatus.COMPLETED,
    });
  }

  public async deletePartner(partnerId: number): Promise<void> {
    const partner = await this.partnerRepository.get({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException({
        ...PARTNER_ERRORS.GET,
      });
    }

    if (partner.path) {
      await this.fileManagerService.deleteFiles([partner.path]);
    }

    await this.partnerRepository.save({
      ...partner,
      path: null,
      numberOfPartners: null,
      status: CompletionStatus.NOT_COMPLETED,
    });
  }

  public async deleteInvestor(investorId: number): Promise<void> {
    const investor = await this.investorRepository.get({
      where: { id: investorId },
    });

    if (!investor) {
      throw new NotFoundException({
        ...INVESTOR_ERRORS.GET,
      });
    }

    if (investor.path) {
      await this.fileManagerService.deleteFiles([investor.path]);
    }

    await this.investorRepository.save({
      ...investor,
      path: null,
      numberOfInvestors: null,
      status: CompletionStatus.NOT_COMPLETED,
    });
  }
}
