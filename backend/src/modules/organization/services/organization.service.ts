import { Injectable, NotFoundException } from '@nestjs/common';
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
        ...createOrganizationDto.financial,
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
        'organizationFinancial.balanceSheets',
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

    if (updateOrganizationDto.financial) {
      return this.organizationFinancialService.update(
        organization.organizationFinancialId,
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
