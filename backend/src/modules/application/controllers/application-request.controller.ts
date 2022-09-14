import {
  Body,
  ClassSerializerInterceptor,
  Controller,
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
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { ApplicationRequestFilterDto } from 'src/modules/application/dto/application-request-filters.dto';
import { CreateApplicationRequestDto } from 'src/modules/application/dto/create-application-request.dto';
import { ApplicationRequest } from 'src/modules/application/entities/application-request.entity';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';
import { ApplicationRequestService } from '../services/application-request.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('application/request')
export class ApplicationRequestController {
  constructor(
    private readonly applicationRequestService: ApplicationRequestService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => BaseFilterDto })
  @Get('')
  async getApplicationRequests(
    @Query() filters: ApplicationRequestFilterDto,
  ): Promise<Pagination<ApplicationRequest>> {
    return this.applicationRequestService.findAll(filters);
  }

  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateApplicationRequestDto })
  @Post('')
  createApplicationRequest(
    @Body() createRequestDto: CreateApplicationRequestDto,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.applicationRequestService.create(
      user.organizationId,
      createRequestDto.applicationId,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch(':id/approve')
  approveApplicationRequest(@Param('id') id: number): Promise<void> {
    return this.applicationRequestService.approve(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch(':id/reject')
  rejectApplicationRequest(@Param('id') id: number): Promise<void> {
    return this.applicationRequestService.reject(id);
  }
}
