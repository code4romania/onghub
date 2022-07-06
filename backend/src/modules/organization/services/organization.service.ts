import { Injectable, NotFoundException } from '@nestjs/common';
import { AnafService } from 'src/shared/services';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { In } from 'typeorm';
import { OrganizationFinancialService } from '.';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from '../constants/errors.constants';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationActivityService } from './organization-activity.service';
import { OrganizationGeneralService } from './organization-general.service';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationReportService } from './organization-report.service';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { Income } from '../dto/income.dto';
import { Expense } from '../dto/expense.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationGeneralService: OrganizationGeneralService,
    private readonly organizationActivityService: OrganizationActivityService,
    private readonly organizationLegalService: OrganizationLegalService,
    private readonly organizationFinancialService: OrganizationFinancialService,
    private readonly organizationReportService: OrganizationReportService,
    private readonly nomenclaturesService: NomenclaturesService,
    private readonly anafService: AnafService,
  ) {}

  public async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const domains = await this.nomenclaturesService.getDomains({
      where: { id: In(createOrganizationDto.activity.domains) },
    });

    const cities = await this.nomenclaturesService.getCities({
      where: { id: In(createOrganizationDto.activity.cities) },
    });

    const currentYear = new Date().getFullYear();

    const anafData = await this.anafService.processAnafData(
      createOrganizationDto.general.cui,
      currentYear,
    );
    let totalMoney: number;
    let employees: number;
    let dataType: Income | Expense;
    if (anafData === null) {
      totalMoney = -1;
      employees = -1;
    } else if (createOrganizationDto.financial.type === FinancialType.EXPENSE) {
      totalMoney = anafData.expense;
      dataType = createOrganizationDto.financial.expense;
      employees = anafData.employees;
    } else {
      totalMoney = anafData.income;
      dataType = createOrganizationDto.financial.income;
      employees = anafData.employees;
    }

    // create the parent entry with default values
    return this.organizationRepository.save({
      organizationGeneral: {
        ...createOrganizationDto.general,
      },
      organizationActivity: {
        ...createOrganizationDto.activity,
        domains,
        cities,
      },
      organizationLegal: {
        ...createOrganizationDto.legal,
      },
      organizationFinancial: {
        type: createOrganizationDto.financial.type,
        numberOfEmployees: employees,
        total: totalMoney,
        year: currentYear,
        data: dataType,
      },
      organizationReport: {
        ...createOrganizationDto.report,
      },
    });
  }

  public async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.get({
      where: { id },
      relations: [
        'organizationGeneral',
        'organizationGeneral.city',
        'organizationGeneral.county',
        'organizationGeneral.contact',
        'organizationActivity',
        'organizationActivity.area',
        'organizationActivity.domains',
        'organizationActivity.cities',
        'organizationLegal',
        'organizationLegal.legalReprezentative',
        'organizationLegal.directors',
        'organizationFinancial',
        'organizationReport',
      ],
    });

    if (!organization) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG001,
      });
    }

    return organization;
  }

  /**
   * Update organization will only update one child at the time
   * TODO: Review if we put this in organization
   */
  public async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<any> {
    const organization = await this.organizationRepository.get({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
      });
    }

    if (updateOrganizationDto.general) {
      return this.organizationGeneralService.update(
        organization.organizationGeneralId,
        updateOrganizationDto.general,
      );
    }

    if (updateOrganizationDto.activity) {
      return this.organizationActivityService.update(
        organization.organizationActivityId,
        updateOrganizationDto.activity,
      );
    }

    if (updateOrganizationDto.legal) {
      return this.organizationLegalService.update(
        organization.organizationLegalId,
        updateOrganizationDto.legal,
      );
    }

    // if (updateOrganizationDto.financial) {
    //   const anafData = await this.anafService.processAnafData(organization.organizationGeneral.cui, new Date().getFullYear());
    //   this.organizationFinancialService
    // }

    if (updateOrganizationDto.report) {
      return this.organizationReportService.update(
        organization.organizationReportId,
        updateOrganizationDto.report,
      );
    }

    return null;
  }
}
