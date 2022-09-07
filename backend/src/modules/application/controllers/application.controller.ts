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
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { Application } from '../entities/application.entity';
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

  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => BaseFilterDto })
  @Get('request')
  async getApplicationRequests(
    @Query() filters: ApplicationRequestFilterDto,
  ): Promise<Pagination<ApplicationRequest>> {
    console.log('herre');
    return this.applicationRequestService.findAll(filters);
  }

  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateApplicationRequestDto })
  @Post('request')
  createApplicationRequest(
    @Body() createRequestDto: CreateApplicationRequestDto,
    @ExtractUser() user: User,
  ): Promise<any> {
    return this.applicationRequestService.create(
      user.organizationId,
      createRequestDto.applicationId,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/approve')
  approveApplicationRequest(
    @Param('id') id: number,
  ): Promise<{ success: boolean }> {
    return this.applicationRequestService.approve(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/reject')
  rejectApplicationRequest(
    @Param('id') id: number,
  ): Promise<{ success: boolean }> {
    return this.applicationRequestService.reject(id);
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/abandon')
  abandonRequest(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<{ success: boolean }> {
    return this.applicationRequestService.abandon(id, user.organizationId);
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
  @Delete(':id')
  removeOne(@Param('id') id: number): Promise<{ success: boolean }> {
    return this.applicationService.deleteOne(id);
  }
}
