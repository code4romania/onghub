import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationFinancialDto } from '../dto/update-organization-financial.dto';
import { OrganizationFinancialRepository } from '../repositories';
import { AnafService } from 'src/shared/services';
import { OrganizationFinancial } from '../entities';
import { Income } from '../dto/income.dto';
import { Expense } from '../dto/expense.dto';
import { FinancialType } from '../enums/organization-financial-type.enum';
import {
  HTTP_ERRORS_MESSAGES,
  ERROR_CODES,
} from '../constants/errors.constants';
import { OrganizationGeneralService } from './organization-general.service';

@Injectable()
export class OrganizationFinancialService {
  constructor(
    private readonly organizationFinancialRepository: OrganizationFinancialRepository,
    private readonly anafService: AnafService,
    private readonly organizationGeneralService: OrganizationGeneralService,
  ) {}

  public async findOne(id: number): Promise<OrganizationFinancial> {
    const organizationFinancial =
      await this.organizationFinancialRepository.get({
        where: { id },
        //relations: ['organization'],
      });

    if (!organizationFinancial) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG001,
      });
    }

    return organizationFinancial;
  }

  public async update(
    updateOrganizationFinancialDto: UpdateOrganizationFinancialDto,
  ) {
    const organizationFinancial = await this.findOne(
      updateOrganizationFinancialDto.id,
    );
    const organizationGeneral = await this.organizationGeneralService.findOne(
      updateOrganizationFinancialDto.generalId,
    );
    const anafData = await this.anafService.processAnafData(
      organizationGeneral.cui,
      organizationFinancial.year,
    );
    let totalMoney: number;
    let employees: number;
    let dataType: Income | Expense;

    if (anafData === null) {
      totalMoney = -1;
      employees = -1;
    } else if (organizationFinancial.type === FinancialType.EXPENSE) {
      totalMoney = anafData.expense;
      dataType = updateOrganizationFinancialDto.expense;
      employees = anafData.employees;
    } else {
      totalMoney = anafData.income;
      dataType = updateOrganizationFinancialDto.income;
      employees = anafData.employees;
    }

    let frontMoney: number = 0;
    Object.entries(dataType).forEach(([key, value]) => {
      frontMoney += value;
    });
    if (frontMoney !== totalMoney) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.FINANCIAL,
        errorCode: ERROR_CODES.FIN001,
      });
    }

    return this.organizationFinancialRepository.save({
      id: organizationFinancial.id,
      numberOfEmployees: employees,
      data: dataType,
      total: totalMoney,
    });
  }
}
