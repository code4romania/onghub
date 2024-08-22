import { Injectable, Logger } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationFinancialRepository } from '../repositories';
import { OrganizationFinancialService } from './organization-financial.service';
import { OrganizationReportService } from './organization-report.service';
import * as Sentry from '@sentry/node';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/services/mail.service';
import { MAIL_OPTIONS } from 'src/mail/constants/template.constants';

@Injectable()
export class OrganizationCronsService {
  private readonly logger = new Logger(OrganizationCronsService.name);

  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationFinancialService: OrganizationFinancialService,
    private readonly organizationReportService: OrganizationReportService,
    private readonly mailService: MailService,
  ) {}

  /** 
  * * * * * *
  | | | | | | 
  | | | | | day of week
  | | | | months
  | | | day of month
  | | hours
  | minutes
  seconds (optional)
*/

  @Cron('0 5 1 1 *') // 1st of January, 5:00 AM
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

  @Cron('0 12 1 6 *') // 1st of June, 12 PM server time
  async sendEmailToRemindFinancialDataCompletion() {
    // 1. Get all organizations with are missing the previous year the financial data and reports
    const organizations = await this.organizationRepository.getMany({
      relations: {
        organizationGeneral: true,
        organizationFinancial: true,
      },
    });

    // Filter organization to send email only to those who have the reports available for the last year
    // Some organizations created in the current year will not have the data available
    const receivers = organizations
      .filter((org) => {
        return org.organizationFinancial.some(
          (financialReport) =>
            financialReport.year === new Date().getFullYear() - 1,
        );
      })
      .map((org) => org.organizationGeneral.email);

    const {
      subject,
      template,
      context: {
        title,
        subtitle,
        cta: { link, label },
      },
    } = MAIL_OPTIONS.REMIND_TO_COMPLETE_FINANCIAL_DATA;

    for (let email of receivers) {
      await this.mailService.sendEmail({
        to: email,
        template,
        subject,
        context: {
          title,
          subtitle: subtitle(),
          cta: {
            link: link(),
            label,
          },
        },
      });
    }
  }

  /**
   * At 07:00 (Server Time) every Monday in every month from June through December.
   */
  @Cron('0 7 * 6-12 1')
  async fetchANAFDataForFinancialReports() {
    try {
      await this.organizationFinancialService.refetchANAFDataForFinancialReports();
    } catch (err) {
      Sentry.captureMessage('fetchANAFDataForFinancialReports failed');
      Sentry.captureException(err);
    }
  }
}
