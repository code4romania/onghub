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
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { Role } from 'src/modules/user/enums/role.enum';
import { CivicCenterServiceFilterDto } from '../dto/civic-center-service-filter.dto';
import { CivicCenterServiceSearchFilterDto } from '../dto/civic-center-service-search-filter.dto';
import { CreateCivicCenterServiceDto } from '../dto/create-civic-center-service.dto';
import { UpdateCivicCenterServiceDto } from '../dto/update-civic-center-service.dto';
import { CivicCenterService } from '../entities/civic-center-service.entity';
import { CivicCenterServiceService } from '../services/civic-center.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('civic-center/services')
export class CivicCenterController {
  constructor(
    private readonly civicCenterServiceService: CivicCenterServiceService,
  ) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBody({ type: CreateCivicCenterServiceDto })
  @Post()
  async create(
    @Body() body: CreateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.create(body);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBody({ type: UpdateCivicCenterServiceDto })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.update(id, body);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  async findAll(
    @Query() filters: CivicCenterServiceFilterDto,
  ): Promise<CivicCenterService[]> {
    return this.civicCenterServiceService.findAll({ options: filters });
  }

  @Public()
  @Get('search')
  async searchCivicServices(
    @Query() civicCenterFilters: CivicCenterServiceSearchFilterDto,
  ): Promise<Pagination<CivicCenterService>> {
    return this.civicCenterServiceService.searchCivicCenterServices(
      civicCenterFilters,
    );
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async find(@Param('id') id: number): Promise<CivicCenterService> {
    return this.civicCenterServiceService.find(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.civicCenterServiceService.delete(id);
  }
}
