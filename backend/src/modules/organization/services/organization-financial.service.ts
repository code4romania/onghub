import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationFinancialDto } from '../dto/update-organization-financial.dto';
import { OrganizationFinancialRepository } from '../repositories';
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
import { OnEvent } from '@nestjs/event-emitter';
import CUIChangedEvent from '../events/CUI-changed-event.class';
import { ORGANIZATION_EVENTS } from '../constants/events.constants';
import * as Sentry from '@sentry/node';
import { Not } from 'typeorm';

@Injectable()
export class OrganizationFinancialService {
  private readonly logger = new Logger(OrganizationFinancialService.name);

  constructor(
    private readonly organizationFinancialRepository: OrganizationFinancialRepository,
    private readonly anafService: AnafService,
  ) {
    // this.handleRegenerateFinancial({ organizationId: 170, cui: '29244879' });
  }

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
    if (organizationFinancial.synched_anaf) {
      if (organizationFinancial.total === totals) {
        reportStatus = OrganizationFinancialReportStatus.COMPLETED;
      } else {
        reportStatus = OrganizationFinancialReportStatus.INVALID;
      }
    } else if (totals !== 0) {
      reportStatus = OrganizationFinancialReportStatus.PENDING;
    } else {
      reportStatus = OrganizationFinancialReportStatus.NOT_COMPLETED;
    }

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
        reportStatus: Not(OrganizationFinancialReportStatus.COMPLETED),
      },
    });

    return count;
  }
}
