import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/user/enums/role.enum';
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
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
}
