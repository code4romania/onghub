import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationTableView } from '../entities/application-table-view.entity';
import { Application } from '../entities/application.entity';
import {
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from '../interfaces/application-with-ong-status.interface';
import { ApplicationService } from '../services/application.service';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationOrganizationFilterDto } from '../dto/application-organization-filters.dto';
import { ApplicationOngView } from '../entities/application-ong-view.entity';
import { ApplicationAccessFilterDto } from '../dto/application-access-filter.dto';
import { OngApplicationService } from '../services/ong-application.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Get('')
  getAll(
    @Query() filters: ApplicationFilterDto,
  ): Promise<Pagination<ApplicationTableView>> {
    return this.applicationService.findAll(filters);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateApplicationDto })
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFiles() { logo }: { logo?: Express.Multer.File[] },
  ): Promise<Application> {
    return this.applicationService.create(createApplicationDto, logo);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateApplicationDto })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @UploadedFiles() { logo }: { logo?: Express.Multer.File[] },
  ) {
    return this.applicationService.update(id, updateApplicationDto, logo);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get('organization/:id')
  findOrganizationApplications(
    @Param('id') id: number,
  ): Promise<ApplicationWithOngStatus[]> {
    return this.applicationService.findApplicationsForOng(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch(':id/activate')
  activate(@Param('id') id: number) {
    return this.applicationService.update(id, {
      status: ApplicationStatus.ACTIVE,
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.applicationService.update(id, {
      status: ApplicationStatus.DISABLED,
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ type: () => ApplicationAccessFilterDto })
  @Patch(':id/restrict')
  restrict(
    @Param('id') id: number,
    @Query() filter: ApplicationAccessFilterDto,
  ) {
    return this.applicationService.restrict(id, filter.organizationId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ type: () => ApplicationAccessFilterDto })
  @Patch(':id/restore')
  restore(
    @Param('id') id: number,
    @Query() filter: ApplicationAccessFilterDto,
  ) {
    return this.applicationService.restore(id, filter.organizationId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get(':id/organization')
  findOrganizationsByApplicationId(
    @Param('id') id: number,
    @Query() filters: ApplicationOrganizationFilterDto,
  ): Promise<Pagination<ApplicationOngView>> {
    return this.applicationService.findOrganizationsByApplicationId(
      id,
      filters,
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE)
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<ApplicationWithOngStatusDetails> {
    return this.applicationService.findOne(user.organizationId, id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'organizationId', type: String })
  @Delete(':id/organization/:organizationId')
  removeOneFoOng(
    @Param('id') id: number,
    @Param('organizationId') organizationId: number,
  ): Promise<void> {
    return this.ongApplicationService.delete(id, organizationId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  removeOne(@Param('id') id: number): Promise<void> {
    return this.applicationService.deleteOne(id);
  }
}
