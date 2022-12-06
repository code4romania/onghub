import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApplicationPullingType } from 'src/modules/application/enums/application-pulling-type.enum';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { StatisticsFilterDto } from '../dto/statistics-filter.dto';
import { ILandingCounter } from '../interfaces/landing-counters.interface';
import { StatisticsService } from '../services/statistics.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles(Role.SUPER_ADMIN)
  @Get()
  getSuperAdminStatistics() {
    return this.statisticsService.getAllOrganizationsStatistics();
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get('organization')
  getOrganizationStatistics(@ExtractUser() user: User) {
    return this.statisticsService.getOrganizationStatistics(
      user.organizationId,
      user.role,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get('organization/:id')
  getAdminStatistics(@Param('id') id: string) {
    return this.statisticsService.getOrganizationStatistics(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('request')
  getSuperAdminOrganizationRequestStatistics(
    @Query() filters: StatisticsFilterDto,
  ) {
    return this.statisticsService.getOrganizationRequestStatistics(filters);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('status')
  getSuperAdminOrganizationStatusStatistics(
    @Query() filters: StatisticsFilterDto,
  ) {
    return this.statisticsService.getOrganizationStatusStatistics(filters);
  }

  @Public()
  @ApiQuery({ name: 'pulling_type', type: () => ApplicationPullingType })
  @Get('landing-counters')
  getLandingCounters(
    @Query('pulling_type') pullingType: ApplicationPullingType,
  ): Promise<ILandingCounter> {
    return this.statisticsService.getLandingCounters(pullingType);
  }
}
