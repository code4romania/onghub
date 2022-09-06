import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Param,
  Body,
  Post,
  Query,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/user/enums/role.enum';
import { ApplicationRequestFilterDto } from '../dto/application-request-filters.dto';
import { ApplicationRequest } from '../entities/application-request.entity';
import { CreateApplicationRequestDto } from '../dto/create-application-request.dto';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { ApplicationRequestService } from '../services/application-request.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('application')
export class ApplicationRequestController {
  constructor(
    private readonly applicationRequestService: ApplicationRequestService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => BaseFilterDto })
  @Get('request')
  async getAll(
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
}
