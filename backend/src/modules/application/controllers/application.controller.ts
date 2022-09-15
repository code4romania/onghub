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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { Application } from '../entities/application.entity';
import { ApplicationAccess } from '../interfaces/application-access.interface';
import { ApplicationWithOngStatusDetails } from '../interfaces/application-with-ong-status.interface';
import { ApplicationRequestService } from '../services/application-request.service';
import { ApplicationService } from '../services/application.service';

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
  ): Promise<Pagination<Application>> {
    return this.applicationService.findAll(filters);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiBody({ type: CreateApplicationDto })
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.create(createApplicationDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateApplicationDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(+id, updateApplicationDto);
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
