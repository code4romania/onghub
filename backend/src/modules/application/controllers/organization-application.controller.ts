import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTooManyRequestsResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../../user/enums/role.enum';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { IOngApplication } from '../interfaces/ong-application.interface';
import { OrganizationApplicationFilterDto } from 'src/modules/application/dto/organization-application.filters.dto';
import { ApplicationAccess } from 'src/modules/application/interfaces/application-access.interface';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { OngApplication } from 'src/modules/application/entities/ong-application.entity';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';
import { ApplicationService } from '../services/application.service';
import { OngApplicationFilterDto } from '../dto/ong-application-filters.dto';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organizations/application')
export class OrganizationApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
  ) {}

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiQuery({ type: () => OrganizationApplicationFilterDto })
  @Get()
  findApplications(
    @Query() filters: OngApplicationFilterDto,
    @ExtractUser() user: User,
  ): Promise<IOngApplication[]> {
    const userId = user.role === Role.EMPLOYEE ? user.id : undefined;
    return this.ongApplicationService.findOrganizationApplications(
      user.organizationId,
      {
        ...filters,
        userId,
      },
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Get('user')
  findActiveOngApplications(
    @ExtractUser() user: User,
  ): Promise<ApplicationAccess[]> {
    return this.applicationService.findActiveOngApplications(
      user.organizationId,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Get('user/:id')
  findOrganizationApplicationsWithStatusForEmployee(
    @ExtractUser() user: User,
    @Param('id') userId: number,
  ): Promise<ApplicationAccess[]> {
    return this.applicationService.findActiveOngApplications(
      user.organizationId,
      userId,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Post(':id/request')
  createApplicationRequest(
    @Param('id') applicationId: number,
    @ExtractUser() user: User,
  ): Promise<OngApplication> {
    return this.ongApplicationService.create(
      user.organizationId,
      applicationId,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id/request')
  abandonRequest(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.ongApplicationService.delete(
      id,
      user.organizationId,
      OngApplicationStatus.PENDING,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  removeOneFoOngUser(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.ongApplicationService.requestOngApplicationDeletion(
      id,
      user.organizationId,
    );
  }
}
