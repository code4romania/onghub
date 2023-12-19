import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { CreateFeedbackDto } from 'src/modules/civic-center-service/dto/create-feedback.dto';
import { Feedback } from 'src/modules/civic-center-service/entities/feedback.entity';
import { CivicCenterServiceFlat } from 'src/modules/civic-center-service/interfaces/CivicCenterServiceFlat';
import { FeedbackService } from 'src/modules/civic-center-service/services/feedback.service';
import { OrganizationWithServices } from 'src/modules/organization/interfaces/OrganizationWithServices.interface';
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
    private readonly feedbackService: FeedbackService,
  ) {}

  @Public()
  @Get('/search')
  async searchCivicServices(
    @Query() civicCenterFilters: CivicCenterServiceSearchFilterDto,
  ): Promise<Pagination<CivicCenterServiceFlat>> {
    return this.civicCenterServicePublic.search(civicCenterFilters);
  }

  @Public()
  @Get('/organization')
  async searchOrganizationsWithServices(
    @Query() filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.civicCenterServicePublic.getOrganizations(filters);
  }

  @Public()
  @ApiParam({ name: 'id', type: String })
  @Get('/organization/:id')
  findOrganizationWithServices(
    @Param('id') id: number,
  ): Promise<OrganizationWithServices> {
    return this.civicCenterServicePublic.getOrganization(id);
  }

  @Public()
  @Get('/:id')
  async getServiceById(
    @Param('id') id: number,
  ): Promise<
    CivicCenterService & { organizationId: number; organizationName: string }
  > {
    return this.civicCenterServicePublic.get(id);
  }

  @Public()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: CreateFeedbackDto })
  @Post('/service/:id/feedback')
  async create(
    @Param('id') id: string,
    @Body() body: CreateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.create(+id, body);
  }
}
