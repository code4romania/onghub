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
import { ApplicationView } from '../entities/application-view.entity';
import { Application } from '../entities/application.entity';
import { ApplicationAccess } from '../interfaces/application-access.interface';
import { ApplicationWithOngStatusDetails } from '../interfaces/application-with-ong-status.interface';
import { ApplicationRequestService } from '../services/application-request.service';
import { ApplicationService } from '../services/application.service';
import { ApplicationOngView } from '../entities/application-ong-view.entity';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { ApplicationOrganizationFilterDto } from '../dto/application-organization-filters.dto';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationRequestService: ApplicationRequestService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Get('')
  getAll(
    @Query() filters: ApplicationFilterDto,
  ): Promise<Pagination<ApplicationView>> {
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

  @Roles(Role.ADMIN)
  @Get('organization')
  findAvailableApplicationsForOng(
    @ExtractUser() user: User,
  ): Promise<ApplicationAccess[]> {
    return this.applicationService.findApplicationsForOngWithAccessStatus(
      user.organizationId,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'userId', type: String })
  @Get('organization/:userId')
  findAvailableApplicationsForOngUser(
    @ExtractUser() user: User,
    @Param('userId') userId: number,
  ): Promise<ApplicationAccess[]> {
    return this.applicationService.findActiveApplicationsForOngUserWithAccessStatus(
      user.organizationId,
      userId,
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

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id/request')
  abandonRequest(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.applicationRequestService.abandon(id, user.organizationId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  removeOne(@Param('id') id: number): Promise<void> {
    return this.applicationService.deleteOne(id);
  }
}
