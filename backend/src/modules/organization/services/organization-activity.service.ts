import { BadRequestException, Injectable } from '@nestjs/common';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { In } from 'typeorm';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import { UpdateOrganizationActivityDto } from '../dto/update-organization-activity.dto';
import { Area } from '../enums/organization-area.enum';
import { OrganizationActivityRepository } from '../repositories';

@Injectable()
export class OrganizationActivityService {
  constructor(
    private readonly organizationActivityRepository: OrganizationActivityRepository,
    private readonly nomenclaturesService: NomenclaturesService,
  ) { }

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
        ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.LOCAL,
      });
    }

    if (
      updateOrganizationActivityDto.area === Area.REGIONAL &&
      !updateOrganizationActivityDto.regions
    ) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.REGION,
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
          ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.FEDERATION,
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
          ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.COALITION,
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
          ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.BRANCH,
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
        ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.INTERNATION_ORGANIZATION,
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
        'branches.county',
        'domains',
        'cities',
        'federations',
        'coalitions',
        'regions',
        'cities.county'
      ],
    });
  }
}
