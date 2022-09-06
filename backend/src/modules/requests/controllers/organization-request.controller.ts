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
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { Role } from 'src/modules/user/enums/role.enum';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { OrganizationRequestService } from '../services/organization-request.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationRequestController {
  constructor(
    private readonly organizationRequestService: OrganizationRequestService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => BaseFilterDto })
  @Get('request')
  async getAll(
    @Query() filters: BaseFilterDto,
  ): Promise<Pagination<OrganizationRequest>> {
    return this.organizationRequestService.findAll(filters);
  }

  @Public()
  @ApiBody({ type: CreateOrganizationRequestDto })
  @Post('request')
  create(@Body() createRequestDto: CreateOrganizationRequestDto): Promise<any> {
    return this.organizationRequestService.create(createRequestDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get('request/:id')
  findOne(@Param('id') id: string): Promise<OrganizationRequest> {
    return this.organizationRequestService.findOne(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/approve')
  approve(@Param('id') id: number): Promise<any> {
    return this.organizationRequestService.approve(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/reject')
  reject(@Param('id') id: number): Promise<any> {
    return this.organizationRequestService.reject(id);
  }
}
