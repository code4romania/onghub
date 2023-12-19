import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/interfaces/pagination';
import { GetOrganizationWithPracticeProgramsFilterDto } from 'src/modules/organization/dto/get-organization-with-practice-programs-fillter.dto';
import { OrganizationFlat } from 'src/modules/organization/interfaces/OrganizationFlat.interface';
import { OrganizationWithPracticePrograms } from 'src/modules/organization/interfaces/OrganizationWithPracticePrograms.interface';
import { OrganizationService } from 'src/modules/organization/services';
import { PracticeProgramFilterDto } from 'src/modules/practice-program/dto/practice-program-filter.dto';
import { PracticeProgramService } from 'src/modules/practice-program/services/practice-program.service';

@Injectable()
export class PracticeProgramPublicService {
  constructor(
    private readonly practiceProgramService: PracticeProgramService,
    private readonly organizationService: OrganizationService,
  ) {}

  public async search(
    practiceProgramSearchFilterDto: PracticeProgramFilterDto,
  ) {
    return this.practiceProgramService.searchPracticePrograms(
      practiceProgramSearchFilterDto,
    );
  }

  public async getOrganizations(
    filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.organizationService.findAllOrganizationsWithActivePracticePrograms(
      filters,
    );
  }

  public async getOrganization(
    id: number,
  ): Promise<OrganizationWithPracticePrograms> {
    return this.organizationService.findOneOrganizationWithActivePracticePrograms(
      id,
    );
  }

  public async get(id: number) {
    return this.practiceProgramService.findWithOrganization(id);
  }
}
