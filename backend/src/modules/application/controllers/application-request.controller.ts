import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { Role } from '../../user/enums/role.enum';
import { OngApplication } from '../entities/ong-application.entity';
import { OrganizationApplicationRequest } from '../interfaces/organization-application-request.interface';
import { OngApplicationService } from '../services/ong-application.service';

@Roles(Role.SUPER_ADMIN)
@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('application/request')
export class ApplicationRequestController {
  constructor(private readonly ongApplicationService: OngApplicationService) {}

  @ApiQuery({ type: () => BaseFilterDto })
  @Get('')
  async getApplicationRequests(
    @Query() filters: BaseFilterDto,
  ): Promise<Pagination<OngApplication>> {
    return this.ongApplicationService.findAllRequests(filters);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('organization/:id')
  findOrganizationApplicationRequests(
    @Param('id') id: number,
  ): Promise<OrganizationApplicationRequest[]> {
    return this.ongApplicationService.findRequestsByOrganizationId(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id/approve')
  approveApplicationRequest(@Param('id') id: number): Promise<void> {
    return this.ongApplicationService.approve(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id/reject')
  rejectApplicationRequest(@Param('id') id: number): Promise<void> {
    return this.ongApplicationService.reject(id);
  }
}
