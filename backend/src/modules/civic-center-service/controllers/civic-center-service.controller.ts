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
import { Role } from 'src/modules/user/enums/role.enum';
import { CivicCenterServiceFilterDto } from '../dto/civic-center-service-filter.dto';
import { CreateCivicCenterServiceDto } from '../dto/create-civic-center-service.dto';
import { UpdateCivicCenterServiceDto } from '../dto/update-civic-center-service.dto';
import { CivicCenterService } from '../entities/civic-center-service.entity';
import { CivicCenterServiceService } from '../services/civic-center-service.service';

@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('civic-center-service')
export class CivicCenterServiceController {
  constructor(
    private readonly civicCenterServiceService: CivicCenterServiceService,
  ) {}

  @ApiBody({ type: CreateCivicCenterServiceDto })
  @Post()
  async create(
    @Body() body: CreateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.create(body);
  }

  @ApiBody({ type: UpdateCivicCenterServiceDto })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.update(id, body);
  }

  @Get()
  async findAll(
    @Query() filters: CivicCenterServiceFilterDto,
  ): Promise<CivicCenterService[]> {
    return this.civicCenterServiceService.findAll({ options: filters });
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async find(@Param('id') id: number): Promise<CivicCenterService> {
    return this.civicCenterServiceService.find(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.civicCenterServiceService.delete(id);
  }
}
