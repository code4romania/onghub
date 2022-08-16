import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'src/common/interfaces/pagination';
import { ExtractUser } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Controller('user')
@ApiBearerAuth()
// TODO: add permissions for Admin (SuperAdmin and Admin)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  // TODO: restrict to be called only by Admin/Super-Admin
  @ApiBody({ type: CreateUserDto })
  @Post('')
  async create(@Body() body: CreateUserDto) {
    return this.userService.createEmployee({
      email: body.email,
      name: body.name,
      phone: body.phone,
      organizationId: body.organizationId,
    });
  }

  @ApiQuery({ type: () => UserFilterDto })
  @Get('')
  async getAll(
    @ExtractUser() user: User,
    @Query() filters: UserFilterDto,
  ): Promise<Pagination<User>> {
    return this.userService.findAll(user.organizationId, filters);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async getOne(@Param('id') userId: number): Promise<User> {
    return this.userService.getById(userId);
  }

  // TODO: restrict to be called only by Admin/Super-Admin
  @ApiBody({ type: Number, isArray: true })
  @Patch('restrict')
  restrict(
    @Body(new ParseArrayPipe({ items: Number }))
    ids: number[],
  ) {
    return this.userService.restrictAccess(ids);
  }

  // TODO: restrict to be called only by Admin/Super-Admin
  @ApiBody({ type: Number, isArray: true })
  @Patch('activate')
  restore(
    @Body(new ParseArrayPipe({ items: Number }))
    ids: number[],
  ) {
    return this.userService.restoreAccess(ids);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async update(
    @Param('id') userId: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, body);
  }

  // TODO: restrict to be called only by Admin/Super-Admin
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.removeById(id);
  }
}
