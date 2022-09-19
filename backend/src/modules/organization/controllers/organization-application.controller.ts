import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  Query,
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
import { ApplicationWithOngStatus } from '../../application/interfaces/application-with-ong-status.interface';
import { ApplicationService } from '../../application/services/application.service';
import { OngApplicationService } from '../../application/services/ong-application.service';
import { OrganizationApplicationFilterDto } from 'src/modules/application/dto/organization-application.filters.dto';
import { ApplicationAccess } from 'src/modules/application/interfaces/application-access.interface';
import { ApplicationRequestService } from 'src/modules/application/services/application-request.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization/application')
export class OrganizationApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
    private readonly applicationRequestService: ApplicationRequestService,
  ) {}

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiQuery({ type: () => OrganizationApplicationFilterDto })
  @Get()
  findApplications(
    @Query() filters: OrganizationApplicationFilterDto,
    @ExtractUser() user: User,
  ): Promise<ApplicationWithOngStatus[] | ApplicationAccess[]> {
    return this.applicationService.findOrganizationAplications(user, filters);
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Get('user/:id')
  findOrganizationApplicationsWithStatusForEmployee(
    @ExtractUser() user: User,
    @Param('id') userId: number,
  ): Promise<ApplicationWithOngStatus[] | ApplicationAccess[]> {
    return this.applicationService.findActiveApplicationsForOngUserWithAccessStatus(
      user.organizationId,
      userId,
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

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  deleteOne(@Param('id') id: number, @ExtractUser() user: User): Promise<void> {
    return this.ongApplicationService.delete(id, user.organizationId);
  }
}
