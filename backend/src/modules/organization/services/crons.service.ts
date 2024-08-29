import { Injectable, Logger } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/organization.repository';
import {
  OrganizationFinancialRepository,
  OrganizationViewRepository,
} from '../repositories';
import { OrganizationFinancialService } from './organization-financial.service';
import { OrganizationReportService } from './organization-report.service';
import * as Sentry from '@sentry/node';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/services/mail.service';
import { MAIL_OPTIONS } from 'src/mail/constants/template.constants';
import { EntityManager, In, Not, getManager } from 'typeorm';
import {
  CompletionStatus,
  OrganizationFinancialReportStatus,
} from '../enums/organization-financial-completion.enum';

@Injectable()
export class OrganizationCronsService {
  private readonly logger = new Logger(OrganizationCronsService.name);

  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationViewRepository: OrganizationViewRepository,
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
    const thisYear = new Date().getFullYear();
    const lastYear = thisYear - 1;

    // 1. Get all organizations with are missing the previous year the financial data and reports
    const organizations = await this.organizationRepository.getMany({
      where: {
        organizationGeneral: {
          yearCreated: Not(thisYear),
        },
      },
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

  /**
   *
   *  Organizations must complete their reports until 30th of June each year, otherwise the account will be suspended
   *
   *  The reports are:
   *    1. Financial Report
   *    2. ONG In Numere
   *      2.1. Reports
   *      2.2. Investors
   *      2.3. Partners
   *
   *
   *  On 1st Of june, we send an email to all organization which didn't fully complete their reports.
   *
   */
  @Cron('0 12 1 6 *') // 1st of June, 12 PM server time
  async sendEmailToRemindOrganizationProfileUpdate() {
    // 1. Get all organizations missin the completion of financial data and reports
    const organizations: { adminEmail: string }[] =
      await this.organizationViewRepository.getMany({
        where: {
          completionStatus: CompletionStatus.NOT_COMPLETED,
        },
        select: {
          adminEmail: true,
        },
      });

    const receivers = organizations.map((org) => org.adminEmail);

    const {
      subject,
      template,
      context: {
        title,
        subtitle,
        cta: { link, label },
      },
    } = MAIL_OPTIONS.REMIND_TO_UPDATE_ORGANIZATION_REPORTS;

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

  // Every monday at 8:00 AM (server time) from 8th to 30th of June
  @Cron('0 8 8-30 6 1')
  async sendReminderForOrganizationProfileUpdate() {
    // 1. Get all organizations missin the completion of financial data and reports
    const organizations: { adminEmail: string }[] =
      await this.organizationViewRepository.getMany({
        where: {
          completionStatus: CompletionStatus.NOT_COMPLETED,
        },
        select: {
          adminEmail: true,
        },
      });

    const receivers = organizations.map((org) => org.adminEmail);

    const {
      subject,
      template,
      context: {
        title,
        subtitle,
        cta: { link, label },
      },
    } = MAIL_OPTIONS.WEEKLY_REMINDER_TO_UPDATE_ORGANIZATION_REPORTS;

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
