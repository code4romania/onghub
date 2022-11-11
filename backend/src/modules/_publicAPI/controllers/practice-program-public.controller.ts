import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { OrganizationWithPracticePrograms } from 'src/modules/organization/interfaces/OrganizationWithPracticePrograms.interface';
import { PracticeProgramFilterDto } from 'src/modules/practice-program/dto/practice-program-filter.dto';
import { PracticeProgram } from 'src/modules/practice-program/entities/practice-program.entity';
import { GetOrganizationWithPracticeProgramsFilterDto } from '../../organization/dto/get-organization-with-practice-programs-fillter.dto';
import { OrganizationFlat } from '../../organization/interfaces/OrganizationFlat.interface';
import { PracticeProgramPublicService } from '../services/practice-program-public.service';

@Public()
@Controller('api/practice-program')
@ApiBearerAuth()
export class PracticeProgramPublicController {
  constructor(
    private readonly practiceProgramService: PracticeProgramPublicService,
  ) {}

  @Public()
  @Get('/search')
  async searchPracticePrograms(
    @Query() filters: PracticeProgramFilterDto,
  ): Promise<Pagination<PracticeProgram>> {
    return this.practiceProgramService.search(filters);
  }

  @Public()
  @Get('/organization')
  async searchOrganizationsWithPrograms(
    @Query() filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.practiceProgramService.getOrganizations(filters);
  }

  @Public()
  @ApiParam({ name: 'id', type: String })
  @Get('/organization/:id')
  findOrganizationWithPrograms(
    @Param('id') id: number,
  ): Promise<OrganizationWithPracticePrograms> {
    return this.practiceProgramService.getOrganization(id);
  }

  @Public()
  @Get('/:id')
  async getProgramById(
    @Param('id') id: number,
  ): Promise<
    PracticeProgram & { organizationId: number; organizationName: string }
  > {
    return this.practiceProgramService.get(id);
  }
}
