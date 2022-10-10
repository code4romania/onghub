import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationFinancialDto } from '../dto/update-organization-financial.dto';
import { OrganizationFinancialRepository } from '../repositories';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { OrganizationFinancial } from '../entities';
import { FinancialInformation } from 'src/shared/services/anaf.service';

@Injectable()
export class OrganizationFinancialService {
  constructor(
    private readonly organizationFinancialRepository: OrganizationFinancialRepository,
  ) {}

  public async update(
    updateOrganizationFinancialDto: UpdateOrganizationFinancialDto,
  ) {
    const organizationFinancial =
      await this.organizationFinancialRepository.get({
        where: { id: updateOrganizationFinancialDto.id },
      });

    const totals = Object.values(updateOrganizationFinancialDto.data).reduce(
      (prev: number, current: number) => (prev += +current || 0),
      0,
    );

    if (!organizationFinancial) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.ANAF,
      });
    }

    return this.organizationFinancialRepository.save({
      ...organizationFinancial,
      data: updateOrganizationFinancialDto.data,
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
        numberOfEmployees: financialInformation?.numberOfEmployees ?? 0,
      },
      {
        type: FinancialType.INCOME,
        year,
        total: financialInformation?.totalIncome ?? 0,
        numberOfEmployees: financialInformation?.numberOfEmployees ?? 0,
      },
    ];
  }
}
