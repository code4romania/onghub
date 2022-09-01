import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExtractUser } from '../user/decorators/user.decorator';
import { Role } from '../user/enums/role.enum';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationFilterDto } from './dto/filter-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { ApplicationService } from './services/application.service';
import { OngApplicationService } from './services/ong-application.service';

@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
  ) {}

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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE)
  @Get('')
  getAll(@Query() filters: ApplicationFilterDto) {
    return this.applicationService.findAll(filters);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE)
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiParam({ name: 'id', type: String })
  @Get('ong/:id')
  findOneOngeApplication(@Param('id') id: number, @ExtractUser() user) {
    return this.ongApplicationService.findById(id, user.organizationId);
  }
}
