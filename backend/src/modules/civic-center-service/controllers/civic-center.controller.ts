import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { CreateCivicCenterServiceDto } from '../dto/create-civic-center-service.dto';
import { UpdateCivicCenterServiceDto } from '../dto/update-civic-center-service.dto';
import { CivicCenterService } from '../entities/civic-center-service.entity';
import { CivicCenterServiceService } from '../services/civic-center.service';

@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('civic-center/services')
export class CivicCenterController {
  constructor(
    private readonly civicCenterServiceService: CivicCenterServiceService,
  ) {}

  @ApiBody({ type: CreateCivicCenterServiceDto })
  @Post()
  async create(
    @Body() body: CreateCivicCenterServiceDto,
    @ExtractUser() user: User,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.create({
      ...body,
      organizationId: user.organizationId || body.organizationId,
    });
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id/enable')
  async enable(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.updateServicetatus(
      id,
      true,
      user.role === Role.SUPER_ADMIN,
      user?.organizationId,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id/disable')
  async disable(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.updateServicetatus(
      id,
      false,
      user.role === Role.SUPER_ADMIN,
      user?.organizationId,
    );
  }

  @ApiBody({ type: UpdateCivicCenterServiceDto })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCivicCenterServiceDto,
    @ExtractUser() user: User,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.update(id, {
      ...body,
      organizationId: user.organizationId || body.organizationId,
    });
  }

  @Get()
  async findAll(@ExtractUser() user: User): Promise<CivicCenterService[]> {
    return this.civicCenterServiceService.findAll(user.organizationId);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async find(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<CivicCenterService> {
    return this.civicCenterServiceService.find(id, user.organizationId);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.civicCenterServiceService.delete(
      id,
      user.role === Role.SUPER_ADMIN,
      user.organizationId,
    );
  }
}
