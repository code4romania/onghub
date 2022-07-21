import { Injectable } from '@nestjs/common';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { In } from 'typeorm';
import { UpdateOrganizationActivityDto } from '../dto/update-organization-activity.dto';
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

    if (federations) {
      let federationsData = [];
      if (federations.length > 0) {
        federationsData = await this.nomenclaturesService.getFederations({
          where: { id: In(federations) },
        });
      }
      updateOrganizationData['federations'] = federationsData;
    }

    if (coalitions) {
      let coalitionsData = [];
      if (coalitions.length > 0) {
        coalitionsData = await this.nomenclaturesService.getCoalitions({
          where: { id: In(coalitions) },
        });
      }
      updateOrganizationData['coalitions'] = coalitionsData;
    }

    if (domains) {
      let domainsData = [];
      if (domains.length > 0) {
        domainsData = await this.nomenclaturesService.getDomains({
          where: { id: In(domains) },
        });
      }
      updateOrganizationData['domains'] = domainsData;
    }

    if (regions) {
      let regionsData = [];
      if (regions.length > 0) {
        regionsData = await this.nomenclaturesService.getRegions({
          where: { id: In(regions) },
        });
      }
      updateOrganizationData['regions'] = regionsData;
    }

    if (cities) {
      let citiesData = [];
      if (cities.length > 0) {
        citiesData = await this.nomenclaturesService.getCities({
          where: { id: In(cities) },
        });
      }
      updateOrganizationData['cities'] = citiesData;
    }

    if (branches) {
      let branchesData = [];
      if (branches.length > 0) {
        branchesData = await this.nomenclaturesService.getCities({
          where: { id: In(branches) },
        });
      }
      updateOrganizationData['branches'] = branchesData;
    }

    await this.organizationActivityRepository.save({
      id,
      ...updateOrganizationData,
    });

    return this.organizationActivityRepository.get({
      where: { id },
      relations: ['branches', 'domains', 'cities', 'federations', 'coalitions'],
    });
  }
}
