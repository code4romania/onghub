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
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
import { PracticeProgramFilterDto } from '../dto/practice-program-filter.dto';
import { UpdatePracticeProgramDto } from '../dto/update-practice-program.dto';
import { PracticeProgram } from '../entities/practice-program.entity';
import { PracticeProgramService } from '../services/practice-program.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('practice-program')
export class PracticeProgramController {
  constructor(
    private readonly practiceProgramService: PracticeProgramService,
  ) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBody({ type: CreatePracticeProgramDto })
  @Post()
  async create(
    @Body() body: CreatePracticeProgramDto,
    @ExtractUser() user: User,
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.create({
      ...body,
      organizationId: user.organizationId,
    });
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
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
      organizationId: user.organizationId,
    });
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  async findAll(): Promise<PracticeProgram[]> {
    return this.practiceProgramService.findAll();
  }

  @Public()
  @Get('search')
  async searchPracticePrograms(
    @Query() practiceProgramFilters: PracticeProgramFilterDto,
  ): Promise<Pagination<PracticeProgram>> {
    return this.practiceProgramService.serachPracticePrograms(
      practiceProgramFilters,
    );
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
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
  async delete(@Param('id') id: number): Promise<void> {
    return this.practiceProgramService.delete(id);
  }
}
