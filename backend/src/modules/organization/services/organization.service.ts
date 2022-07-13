import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
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
import { Area } from '../enums/organization-area.enum';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationActivityService } from './organization-activity.service';
import { OrganizationGeneralService } from './organization-general.service';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationReportService } from './organization-report.service';

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

    const regions = await this.nomenclaturesService.getRegions({
      where: { id: In(createOrganizationDto.activity.regions) },
    });

    if (
      createOrganizationDto.activity.area === Area.REGIONAL &&
      regions.length === 0
    ) {
      throw new NotAcceptableException({
        message: HTTP_ERRORS_MESSAGES.REGION,
        errorCode: ERROR_CODES.ORG003,
      });
    }

    const cities = await this.nomenclaturesService.getCities({
      where: { id: In(createOrganizationDto.activity.cities) },
    });

    if (
      createOrganizationDto.activity.area === Area.LOCAL &&
      cities.length === 0
    ) {
      throw new NotAcceptableException({
        message: HTTP_ERRORS_MESSAGES.LOCAL,
        errorCode: ERROR_CODES.ORG004,
      });
    }

    if (createOrganizationDto.legal.directors.length < 3) {
      throw new NotAcceptableException({
        message: HTTP_ERRORS_MESSAGES.DIRECTORS,
        errorCode: ERROR_CODES.ORG006,
      });
    }

    const previousYear = new Date().getFullYear() - 1;
    // get anaf data
    const financialInformation = await this.anafService.getFinancialInformation(
      createOrganizationDto.general.cui,
      new Date().getFullYear() - 1,
    );

    // create the parent entry with default values
    return this.organizationRepository.save({
      organizationGeneral: {
        ...createOrganizationDto.general,
      },
      organizationActivity: {
        ...createOrganizationDto.activity,
        domains,
        regions,
        cities,
      },
      organizationLegal: {
        ...createOrganizationDto.legal,
      },
      organizationFinancial: [
        {
          type: FinancialType.EXPENSE,
          year: new Date().getFullYear() - 1,
          total: financialInformation.totalExpense,
          numberOfEmployees: financialInformation.numberOfEmployees,
        },
        {
          type: FinancialType.INCOME,
          year: new Date().getFullYear() - 1,
          total: financialInformation.totalIncome,
          numberOfEmployees: financialInformation.numberOfEmployees,
        },
      ],
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
        'organizationActivity.domains',
        'organizationActivity.regions',
        'organizationActivity.cities',
        'organizationLegal',
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
      if (updateOrganizationDto.legal.directors.length < 3) {
        throw new NotAcceptableException({
          message: HTTP_ERRORS_MESSAGES.DIRECTORS,
          errorCode: ERROR_CODES.ORG007,
        });
      }
      return this.organizationLegalService.update(
        organization.organizationLegalId,
        updateOrganizationDto.legal,
      );
    }

    if (updateOrganizationDto.financial) {
      return this.organizationFinancialService.update(
        updateOrganizationDto.financial,
      );
    }

    if (updateOrganizationDto.report) {
      return this.organizationReportService.update(
        organization.organizationReportId,
        updateOrganizationDto.report,
      );
    }

    return null;
  }
}
