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
    const { domains, regions, cities, ...updateOrganizationData } =
      updateOrganizationActivityDto;

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

    return this.organizationActivityRepository.save({
      id,
      ...updateOrganizationData,
    });
  }
}
