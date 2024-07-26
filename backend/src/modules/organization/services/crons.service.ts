import { Injectable, Logger } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationFinancialRepository } from '../repositories';
import { OrganizationFinancialService } from './organization-financial.service';
import { OrganizationReportService } from './organization-report.service';
import * as Sentry from '@sentry/node';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrganizationCronsService {
  private readonly logger = new Logger(OrganizationCronsService.name);

  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationFinancialService: OrganizationFinancialService,
    private readonly organizationReportService: OrganizationReportService,
  ) {}

  @Cron('0 0 5 1 1 *') // 1st of January, 5:00 AM
  async generateFinancialDataAndReportsForPreviousYear() {
    const lastYear = new Date().getFullYear() - 1;

    // 1. Get all organizations with are missing the previous year the financial data and reports
    const organizations = await this.organizationRepository.getMany({
      relations: {
        organizationFinancial: true,
        organizationGeneral: true,
        organizationReport: {
          reports: true,
          partners: true,
          investors: true,
        },
      },
    });

    for (const org of organizations) {
      try {
        // 2. Generate the financial reports
        await this.organizationFinancialService.generateNewReports({
          organization: org,
          year: lastYear,
        });

        // 5. Generate the Reports / Partners / Investors
        await this.organizationReportService.generateNewReports({
          organization: org,
          year: lastYear,
        });
      } catch (err) {
        this.logger.error(err);
        Sentry.captureException(err, {
          extra: {
            organizationId: org.id,
            year: lastYear,
          },
        });
      }
    }
  }
}
