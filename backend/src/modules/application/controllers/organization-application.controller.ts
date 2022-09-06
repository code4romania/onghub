import {
  Controller,
  Delete,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';
import {
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from '../interfaces/application-with-ong-status.interface';
import { ApplicationService } from '../services/application.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get('application')
  findAll(@ExtractUser() user: User): Promise<ApplicationWithOngStatus[]> {
    return this.applicationService.findAllForOng(user.organizationId);
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiParam({ name: 'id', type: Number })
  @Get('application/:id')
  findOne(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<ApplicationWithOngStatusDetails> {
    return this.applicationService.findOneForOng(user.organizationId, id);
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Delete('application/:id')
  deleteOne(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<{ success: boolean }> {
    return this.applicationService.deleteOneForOng(user.organizationId, id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: Number })
  @Delete('application/:id/restrict')
  restrict(@Param('id') id: number): Promise<{ success: boolean }> {
    return this.applicationService.restrict(id);
  }
}
