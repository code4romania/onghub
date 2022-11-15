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
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
import { UpdatePracticeProgramDto } from '../dto/update-practice-program.dto';
import { PracticeProgram } from '../entities/practice-program.entity';
import { PracticeProgramService } from '../services/practice-program.service';

@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('practice-program')
export class PracticeProgramController {
  constructor(
    private readonly practiceProgramService: PracticeProgramService,
  ) {}

  @ApiBody({ type: CreatePracticeProgramDto })
  @Post()
  async create(
    @Body() body: CreatePracticeProgramDto,
    @ExtractUser() user: User,
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.create({
      ...body,
      organizationId: user.organizationId || body.organizationId,
    });
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id/enable')
  async enable(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.updatePracticeProgramStatus(
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
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.updatePracticeProgramStatus(
      id,
      false,
      user.role === Role.SUPER_ADMIN,
      user?.organizationId,
    );
  }

  @ApiBody({ type: UpdatePracticeProgramDto })
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdatePracticeProgramDto,
    @ExtractUser() user: User,
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.update(id, {
      ...body,
      organizationId: user.organizationId || body.organizationId,
    });
  }

  @Get()
  async findAll(@ExtractUser() user: User): Promise<PracticeProgram[]> {
    return this.practiceProgramService.findAll(user.organizationId);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async find(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.find(id, user.organizationId);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @ExtractUser() user: User,
  ): Promise<void> {
    return this.practiceProgramService.delete(
      id,
      user?.role === Role.SUPER_ADMIN,
      user.organizationId,
    );
  }
}
