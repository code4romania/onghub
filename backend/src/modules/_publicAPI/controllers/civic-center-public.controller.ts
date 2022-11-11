import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { CivicCenterServiceSearchFilterDto } from '../../civic-center-service/dto/civic-center-service-search-filter.dto';
import { CivicCenterService } from '../../civic-center-service/entities/civic-center-service.entity';
import { GetOrganizationWithPracticeProgramsFilterDto } from '../../organization/dto/get-organization-with-practice-programs-fillter.dto';
import { OrganizationFlat } from '../../organization/interfaces/OrganizationFlat.interface';
import { CivicCenterPublicService } from '../services/civic-center-public.service';

@Public()
@Controller('api/civic-service')
@ApiBearerAuth()
export class CivicCenterPublicController {
  constructor(
    private readonly civicCenterServicePublic: CivicCenterPublicService,
  ) {}

  @Public()
  @Get('/search')
  async searchCivicServices(
    @Query() civicCenterFilters: CivicCenterServiceSearchFilterDto,
  ): Promise<Pagination<CivicCenterService>> {
    return this.civicCenterServicePublic.search(civicCenterFilters);
  }

  @Public()
  @Get('/organization')
  async searchOrganizationsWithServices(
    @Query() filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.civicCenterServicePublic.getOrganizations(filters);
  }
}
