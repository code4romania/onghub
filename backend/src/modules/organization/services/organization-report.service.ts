import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { Organization, OrganizationReport } from '../entities';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import {
  INVESTOR_LIST,
  ORGANIZATION_FILES_DIR,
  PARTNER_LIST,
} from '../constants/files.constants';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import * as Sentry from '@sentry/node';
import { Not } from 'typeorm';

@Injectable()
export class OrganizationReportService {
  private readonly logger = new Logger(OrganizationReportService.name);
  constructor(
    private readonly organizationReportRepository: OrganizationReportRepository,
    private readonly partnerRepository: PartnerRepository,
    private readonly investorRepository: InvestorRepository,
    private readonly reportService: ReportService,
    private readonly fileManagerService: S3FileManagerService,
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
      numberOfContractors:
        numberOfContractors === undefined
          ? null
          : Math.floor(numberOfContractors),
      numberOfVolunteers:
        numberOfVolunteers === undefined
          ? null
          : Math.floor(numberOfVolunteers),
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

    // TODO: Upgrade this to a service
    if (!partner) {
      throw new NotFoundException({
        ...PARTNER_ERRORS.GET,
      });
    }

    if (partner.path) {
      await this.fileManagerService.deleteFiles([partner.path]);
    }

    try {
      const uploadedFile = await this.fileManagerService.uploadFiles(
        `${organizationId}/${ORGANIZATION_FILES_DIR.PARTNERS}`,
        files,
        FILE_TYPE.FILE,
      );

      await this.partnerRepository.save({
        ...partner,
        path: uploadedFile[0],
        numberOfPartners,
        status: CompletionStatus.COMPLETED,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ORGANIZATION_ERRORS.UPLOAD,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          ...ORGANIZATION_ERRORS.UPLOAD,
          error,
        });
      }
    }
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

    // TODO: Upgrade this to a service
    if (!investor) {
      throw new NotFoundException({
        ...INVESTOR_ERRORS.GET,
      });
    }

    if (investor.path) {
      await this.fileManagerService.deleteFiles([investor.path]);
    }

    try {
      const uploadedFile = await this.fileManagerService.uploadFiles(
        `${organizationId}/${ORGANIZATION_FILES_DIR.INVESTORS}`,
        files,
        FILE_TYPE.FILE,
      );

      await this.investorRepository.save({
        ...investor,
        path: uploadedFile[0],
        numberOfInvestors,
        status: CompletionStatus.COMPLETED,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ORGANIZATION_ERRORS.UPLOAD,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          ...ORGANIZATION_ERRORS.UPLOAD,
          error,
        });
      }
    }
  }

  public async deletePartner(partnerId: number): Promise<void> {
    const partner = await this.partnerRepository.get({
      where: { id: partnerId },
    });

    // TODO: Upgrade this to a service
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

    // TODO: Upgrade this to a service
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

  public async generateNewReports({
    organization,
    year,
  }: {
    organization: Organization;
    year: number;
  }): Promise<void> {
    const organizationReport = organization.organizationReport;

    // Check if the given organizationId has already reports for the given year to avoid duplicating them
    const hasReport = organizationReport.reports.find(
      (report) => report.year === year,
    );
    const hasPartners = organizationReport.partners.find(
      (partner) => partner.year === year,
    );
    const hasInvestors = organizationReport.investors.find(
      (investor) => investor.year === year,
    );

    if (hasReport && hasPartners && hasInvestors) {
      return;
    }

    try {
      await this.organizationReportRepository.save({
        ...organizationReport,
        ...(!hasReport
          ? { reports: [...organizationReport.reports, { year }] }
          : {}),
        ...(!hasPartners
          ? {
              partners: [...organizationReport.partners, { year }],
            }
          : {}),
        ...(!hasInvestors
          ? {
              investors: [...organizationReport.investors, { year }],
            }
          : {}),
      });
    } catch (err) {
      Sentry.captureException(err, {
        extra: {
          organization,
          year,
        },
      });
    }
  }

  public async countNotCompletedReports(organizationId: number) {
    const count = await this.organizationReportRepository.count({
      where: [
        {
          organization: {
            id: organizationId,
          },
          partners: {
            status: Not(CompletionStatus.COMPLETED),
          },
        },
        {
          organization: {
            id: organizationId,
          },
          reports: {
            status: Not(CompletionStatus.COMPLETED),
          },
        },
        {
          organization: {
            id: organizationId,
          },
          investors: {
            status: Not(CompletionStatus.COMPLETED),
          },
        },
      ],
    });

    return count;
  }
}
