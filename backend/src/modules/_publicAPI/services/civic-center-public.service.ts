import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/interfaces/pagination';
import { CivicCenterServiceSearchFilterDto } from 'src/modules/civic-center-service/dto/civic-center-service-search-filter.dto';
import { CivicCenterServiceService } from 'src/modules/civic-center-service/services/civic-center.service';
import { GetOrganizationWithPracticeProgramsFilterDto } from 'src/modules/organization/dto/get-organization-with-practice-programs-fillter.dto';
import { OrganizationFlat } from 'src/modules/organization/interfaces/OrganizationFlat.interface';
import { OrganizationWithServices } from 'src/modules/organization/interfaces/OrganizationWithServices.interface';
import { OrganizationService } from 'src/modules/organization/services';

@Injectable()
export class CivicCenterPublicService {
  constructor(
    private readonly civicCenterService: CivicCenterServiceService,
    private readonly organizationService: OrganizationService,
  ) {}

  public async search(
    civicCenterServiceFilterDto: CivicCenterServiceSearchFilterDto,
  ) {
    return this.civicCenterService.searchCivicCenterServices(
      civicCenterServiceFilterDto,
    );
  }

  public async getOrganizations(
    filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.organizationService.findAllOrganizationsWithActiveServices(
      filters,
    );
  }

  public async getOrganization(id: number): Promise<OrganizationWithServices> {
    return this.organizationService.findOneOrganizationWithActiveServices(id);
  }
}
