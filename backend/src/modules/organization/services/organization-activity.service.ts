import { BadRequestException, Injectable } from '@nestjs/common';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { In } from 'typeorm';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from '../constants/errors.constants';
import { UpdateOrganizationActivityDto } from '../dto/update-organization-activity.dto';
import { Area } from '../enums/organization-area.enum';
import { OrganizationActivityRepository } from '../repositories';

@Injectable()
export class OrganizationActivityService {
  constructor(
    private readonly organizationActivityRepository: OrganizationActivityRepository,
    private readonly nomenclaturesService: NomenclaturesService,
  ) {}

  public async update(
    id: number,
    updateOrganizationActivityDto: UpdateOrganizationActivityDto,
  ) {
    const {
      federations,
      coalitions,
      domains,
      regions,
      cities,
      branches,
      ...updateOrganizationData
    } = updateOrganizationActivityDto;

    if (domains) {
      const updatedDomains = await this.nomenclaturesService.getDomains({
        where: { id: In(domains) },
      });
      updateOrganizationData['domains'] = updatedDomains;
    }

    if (
      updateOrganizationActivityDto.area === Area.LOCAL &&
      !updateOrganizationActivityDto.cities
    ) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.LOCAL,
        errorCode: ERROR_CODES.ORG004,
      });
    }

    if (
      updateOrganizationActivityDto.area === Area.REGIONAL &&
      !updateOrganizationActivityDto.regions
    ) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.REGION,
        errorCode: ERROR_CODES.ORG003,
      });
    }

    if (updateOrganizationActivityDto.area === Area.LOCAL) {
      const updateCities = await this.nomenclaturesService.getCities({
        where: { id: In(cities) },
      });

      updateOrganizationData['cities'] = updateCities;
      updateOrganizationData['regions'] = [];
    }

    if (updateOrganizationActivityDto.area === Area.REGIONAL) {
      const updatedRegions = await this.nomenclaturesService.getRegions({
        where: { id: In(regions) },
      });

      updateOrganizationData['cities'] = [];
      updateOrganizationData['regions'] = updatedRegions;
    }

    if (
      updateOrganizationActivityDto.area === Area.INTERNATIONAL ||
      updateOrganizationActivityDto.area === Area.NATIONAL
    ) {
      updateOrganizationData['cities'] = [];
      updateOrganizationData['regions'] = [];
    }

    if (updateOrganizationActivityDto.isPartOfFederation === true) {
      if (!updateOrganizationActivityDto.federations) {
        throw new BadRequestException({
          message: HTTP_ERRORS_MESSAGES.MISSING_FEDERATIONS,
          errorCode: ERROR_CODES.ORG005,
        });
      }

      const updatedFederations = await this.nomenclaturesService.getFederations(
        {
          where: { id: In(federations) },
        },
      );
      updateOrganizationData['federations'] = updatedFederations;
    } else if (updateOrganizationActivityDto.isPartOfFederation === false) {
      updateOrganizationData['federations'] = [];
    }

    if (updateOrganizationActivityDto.isPartOfCoalition === true) {
      if (!updateOrganizationActivityDto.coalitions) {
        throw new BadRequestException({
          message: HTTP_ERRORS_MESSAGES.MISSING_COALITIONS,
          errorCode: ERROR_CODES.ORG006,
        });
      }

      const updateCoalitions = await this.nomenclaturesService.getCoalitions({
        where: { id: In(coalitions) },
      });
      updateOrganizationData['coalitions'] = updateCoalitions;
    } else if (updateOrganizationActivityDto.isPartOfCoalition === false) {
      updateOrganizationData['coalitions'] = [];
    }

    if (updateOrganizationActivityDto.hasBranches === true) {
      if (!updateOrganizationActivityDto.branches) {
        throw new BadRequestException({
          message: HTTP_ERRORS_MESSAGES.MISSING_BRANCHES,
          errorCode: ERROR_CODES.ORG007,
        });
      }

      const updatedBranches = await this.nomenclaturesService.getCities({
        where: { id: In(branches) },
      });
      updateOrganizationData['branches'] = updatedBranches;
    } else if (updateOrganizationActivityDto.hasBranches === false) {
      updateOrganizationData['branches'] = [];
    }

    if (
      !updateOrganizationActivityDto.internationalOrganizationName &&
      updateOrganizationActivityDto.isPartOfInternationalOrganization
    ) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.MISSING_INTERNATIONAL_ORGANIZATION,
        errorCode: ERROR_CODES.ORG008,
      });
    }

    updateOrganizationData['internationalOrganizationName'] =
      updateOrganizationActivityDto.isPartOfInternationalOrganization
        ? updateOrganizationActivityDto.internationalOrganizationName
        : null;

    await this.organizationActivityRepository.save({
      id,
      ...updateOrganizationData,
    });

    return this.organizationActivityRepository.get({
      where: { id },
      relations: [
        'branches',
        'domains',
        'cities',
        'federations',
        'coalitions',
        'regions',
      ],
    });
  }
}
