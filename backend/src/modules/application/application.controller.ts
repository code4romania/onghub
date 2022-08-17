import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { ApplicationService } from './services/application.service';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

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

  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.SUPER_ADMIN)
  @Get('all')
  viewAll() {
    return this.applicationService.findAll({});
  }
}
