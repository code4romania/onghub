import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationFinancialDto } from '../dto/update-organization-financial.dto';
import {
  OrganizationFinancialRepository,
  OrganizationRepository,
} from '../repositories';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import {
  CompletionStatus,
  OrganizationFinancialReportStatus,
} from '../enums/organization-financial-completion.enum';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { Organization, OrganizationFinancial } from '../entities';
import {
  AnafService,
  FinancialInformation,
} from 'src/shared/services/anaf.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import CUIChangedEvent from '../events/CUI-changed-event.class';
import { ORGANIZATION_EVENTS } from '../constants/events.constants';
import * as Sentry from '@sentry/node';
import { In, Not } from 'typeorm';
import { EVENTS } from 'src/modules/notifications/constants/events.contants';
import InvalidFinancialReportsEvent from 'src/modules/notifications/events/invalid-financial-reports-event.class';

@Injectable()
export class OrganizationFinancialService {
  private readonly logger = new Logger(OrganizationFinancialService.name);

  constructor(
    private readonly organizationFinancialRepository: OrganizationFinancialRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly anafService: AnafService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // TODO: Deprecated, we don't allow changing the CUI anymore, so this is obsolete. To be discussed and deleted
  @OnEvent(ORGANIZATION_EVENTS.CUI_CHANGED)
  async handleCuiChanged({ organizationId, newCUI }: CUIChangedEvent) {
    return this.handleRegenerateFinancial({ organizationId, cui: newCUI });
  }

  // TODO: Deprecated, we don't allow changing the CUI anymore, so this is obsolete. To be discussed and deleted
  public async handleRegenerateFinancial({
    organizationId,
    cui,
  }: {
    organizationId: number;
    cui: string;
  }) {
    try {
      // 1. Delete the financial data for the given organization ID
      await this.organizationFinancialRepository.remove({
        where: { organizationId },
      });
      // 2. Get the financial data from ANAF for the new CUI
      const lastYear = new Date().getFullYear() - 1;
      const financialFromAnaf = await this.getFinancialInformationFromANAF(
        cui,
        lastYear,
      );

      // 3. Generate reports data
      const newFinancialReport = this.generateFinancialReportsData(
        lastYear,
        financialFromAnaf,
      );
      // 4. Save the new reports
      const saved = await Promise.all(
        newFinancialReport.map((orgFinancial) =>
          this.organizationFinancialRepository.save({
            ...orgFinancial,
            organizationId,
          }),
        ),
      );

      return saved;
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ORGANIZATION_ERRORS.UPDATE_ANAF_FINANCIAL,
      });
    }
  }

  public async update(
    updateOrganizationFinancialDto: UpdateOrganizationFinancialDto,
  ) {
    const organizationFinancial =
      await this.organizationFinancialRepository.get({
        where: { id: updateOrganizationFinancialDto.id },
      });

    if (!organizationFinancial) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.ANAF, // TODO: update error as it has incorrect message. Basically here we didn't find the entity to update, we don't have problems with the ANAF data
      });
    }

    const totals = Object.values(updateOrganizationFinancialDto.data).reduce(
      (prev: number, current: number) => (prev += +current || 0),
      0,
    );

    let reportStatus: OrganizationFinancialReportStatus;

    // BR: Look into OrganizationFinancialReportStatus (ENUM) to understand the business logic behind the statuses
    reportStatus = this.determineReportStatus(
      totals,
      organizationFinancial.total,
      organizationFinancial.synched_anaf,
    );

    return this.organizationFinancialRepository.save({
      ...organizationFinancial,
      data: updateOrganizationFinancialDto.data,
      reportStatus,
      // TODO: remove this status
      status:
        totals === organizationFinancial.total
          ? CompletionStatus.COMPLETED
          : CompletionStatus.NOT_COMPLETED,
    });
  }

  public generateFinancialReportsData(
    year: number,
    financialInformation: FinancialInformation,
  ): Partial<OrganizationFinancial>[] {
    return [
      {
        type: FinancialType.EXPENSE,
        year,
        total: financialInformation?.totalExpense ?? 0,
        synched_anaf: financialInformation ? true : false,
        numberOfEmployees: financialInformation?.numberOfEmployees ?? 0,
      },
      {
        type: FinancialType.INCOME,
        year,
        total: financialInformation?.totalIncome ?? 0,
        synched_anaf: financialInformation ? true : false,
        numberOfEmployees: financialInformation?.numberOfEmployees ?? 0,
      },
    ];
  }

  private determineReportStatus(
    addedByOrganizationTotal: number,
    anafTotal: number,
    isSynced: boolean,
  ) {
    if (isSynced) {
      if (anafTotal === addedByOrganizationTotal) {
        return OrganizationFinancialReportStatus.COMPLETED;
      } else {
        return OrganizationFinancialReportStatus.INVALID;
      }
    } else if (addedByOrganizationTotal !== 0) {
      return OrganizationFinancialReportStatus.PENDING;
    } else {
      return OrganizationFinancialReportStatus.NOT_COMPLETED;
    }
  }

  public async getFinancialInformationFromANAF(
    cui: string,
    year: number,
  ): Promise<FinancialInformation> {
    const anafData = await this.anafService.getAnafData(cui, year);

    if (!anafData || (anafData && anafData.length === 0)) {
      return null;
    }

    const income = anafData.find((obj) => {
      return obj.indicator === 'I38';
    });
    const expense = anafData.find((obj) => {
      return obj.indicator === 'I40';
    });
    const employees = anafData.find((obj) => {
      return obj.indicator === 'I46';
    });

    // If any of the required indicators are undefined, it likely means
    // the CUI is not for an NGO or the ANAF service structure has changed
    if (
      income === undefined ||
      expense === undefined ||
      employees === undefined
    ) {
      const missingIndicators = [
        income === undefined ? 'I38 (income)' : null,
        expense === undefined ? 'I40 (expense)' : null,
        employees === undefined ? 'I46 (employees)' : null,
      ]
        .filter(Boolean)
        .join(', ');

      const sentryMessage = `ANAF data missing required indicators (${missingIndicators}) for CUI: ${cui}, Year: ${year}`;
      Sentry.captureMessage(sentryMessage, {
        level: 'warning',
        extra: {
          cui,
          year,
          anafData,
          missingIndicators,
        },
      });
      this.logger.warn(sentryMessage);
      return null;
    }

    return {
      numberOfEmployees: employees?.val_indicator,
      totalExpense: expense?.val_indicator,
      totalIncome: income?.val_indicator,
    };
  }

  public async generateNewReports({
    organization,
    year,
  }: {
    organization: Organization;
    year: number;
  }): Promise<void> {
    if (
      organization.organizationFinancial.find(
        (financial) => financial.year === year,
      )
    ) {
      // Avoid duplicating data
      return;
    }

    const financialFromAnaf = await this.getFinancialInformationFromANAF(
      organization.organizationGeneral.cui,
      year,
    );

    // 3. Generate financial reports data
    const newFinancialReport = this.generateFinancialReportsData(
      year,
      financialFromAnaf,
    );

    // 4. Save the new reports
    try {
      await Promise.all(
        newFinancialReport.map((orgFinancial) =>
          this.organizationFinancialRepository.save({
            ...orgFinancial,
            organizationId: organization.id,
          }),
        ),
      );
    } catch (err) {
      Sentry.captureException(err, {
        extra: { organization, year },
      });
    }
  }

  public async countNotCompletedReports(organizationId: number) {
    const count = await this.organizationFinancialRepository.count({
      where: {
        organizationId,
        reportStatus: Not(
          In([
            OrganizationFinancialReportStatus.COMPLETED,
            OrganizationFinancialReportStatus.PENDING,
          ]),
        ),
      },
    });

    return count;
  }

  async refetchANAFDataForFinancialReports() {
    // 1. Find all organizations with missing ANAF data in the Financial Reports
    type OrganizationsWithMissingANAFData = {
      id: number;
      organizationFinancial: OrganizationFinancial[];
      organizationGeneral: { cui: string; email: string };
    };

    const data: OrganizationsWithMissingANAFData[] =
      await this.organizationRepository.getMany({
        relations: {
          organizationFinancial: true,
          organizationGeneral: true,
        },
        where: {
          organizationFinancial: {
            synched_anaf: false,
          },
        },
        select: {
          id: true,
          organizationGeneral: {
            cui: true,
            email: true,
          },
          organizationFinancial: true,
        },
      });

    for (let org of data) {
      try {
        // Find all years for which we should call ANAF services
        type YearsFinancial = {
          [year: string]: {
            Income: { id: number; existingTotal: number };
            Expense: { id: number; existingTotal: number };
          };
        };
        const years: YearsFinancial = org.organizationFinancial.reduce(
          (acc, curr) => {
            if (!acc[curr.year]) {
              acc[curr.year] = {};
            }

            const existingData = curr.data as Object;
            let existingTotal = null;

            if (curr.data) {
              existingTotal = Object.keys(existingData).reduce(
                (acc, curr) => acc + +existingData[curr],
                0,
              );
            }

            acc[curr.year][curr.type] = { id: curr.id, existingTotal };

            return acc;
          },
          {},
        );

        // A notification will be sent to the organization if the completed data is invalid
        let sendNotificationForInvalidData = false;

        // Iterate over all years and call ANAF
        for (let year of Object.keys(years)) {
          // 2. Fetch data from ANAF for the given CUI and YEAR
          const anafData = await this.getFinancialInformationFromANAF(
            org.organizationGeneral.cui,
            +year,
          );

          if (anafData) {
            // We have the data, upadate the reports. First "Income"
            if (years[year].Income) {
              const reportStatus = this.determineReportStatus(
                years[year].Income.existingTotal,
                anafData.totalIncome,
                true,
              );
              await this.organizationFinancialRepository.updateOne({
                id: years[year].Income.id,
                total: anafData.totalIncome,
                numberOfEmployees: anafData.numberOfEmployees,
                synched_anaf: true,
                reportStatus,
              });

              sendNotificationForInvalidData = sendNotificationForInvalidData
                ? true
                : reportStatus !== OrganizationFinancialReportStatus.COMPLETED;
            }

            // Second: "Expense"
            if (years[year].Expense) {
              const reportStatus = this.determineReportStatus(
                years[year].Expense.existingTotal,
                anafData.totalExpense,
                true,
              );
              await this.organizationFinancialRepository.updateOne({
                id: years[year].Expense.id,
                total: anafData.totalExpense,
                numberOfEmployees: anafData.numberOfEmployees,
                synched_anaf: true,
                reportStatus,
              });

              sendNotificationForInvalidData = sendNotificationForInvalidData
                ? true
                : reportStatus !== OrganizationFinancialReportStatus.COMPLETED;
            }
          }
        }

        // In case one of the report is invalid, we notify the ADMIN to modify them
        if (sendNotificationForInvalidData) {
          this.eventEmitter.emit(
            EVENTS.INVALID_FINANCIAL_REPORTS,
            new InvalidFinancialReportsEvent(org.organizationGeneral.email),
          );
        }
      } catch (err) {
        Sentry.captureException(err, {
          extra: {
            organization: org.id,
          },
        });
      }
    }
  }
}
