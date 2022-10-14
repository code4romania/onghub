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
import { Role } from 'src/modules/user/enums/role.enum';
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
import { UpdatePracticeProgramDto } from '../dto/update-practice-program.dto';
import { PracticeProgram } from '../entities/practice-program.entity';
import { PracticeProgramService } from '../services/practice-program.service';

@Roles(Role.ADMIN, Role.SUPER_ADMIN)
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
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.create(body);
  }

  @ApiBody({ type: UpdatePracticeProgramDto })
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdatePracticeProgramDto,
  ): Promise<PracticeProgram> {
    return this.practiceProgramService.update(id, body);
  }

  @Get()
  async findAll(): Promise<PracticeProgram[]> {
    return this.practiceProgramService.findAll();
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async find(@Param('id') id: number): Promise<PracticeProgram> {
    return this.practiceProgramService.find(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.practiceProgramService.delete(id);
  }
}
