import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  PartialType,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { ExtractUser } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UserService } from './services/user.service';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { DownloadFiltersDto } from './dto/download-users.filter';

@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('user')
@ApiBearerAuth()
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Post('')
  async create(@Body() body: CreateUserDto) {
    return this.userService.createEmployee({
      email: body.email,
      name: body.name,
      phone: body.phone,
      applicationAccess: body.applicationAccess,
      organizationId: body.organizationId,
    });
  }

  @ApiQuery({ type: () => UserFilterDto })
  @ApiQuery({ name: 'organization_id', type: Number })
  @Get('')
  async getAll(
    @ExtractUser() user: User,
    @Query() filters: UserFilterDto,
    @Query('organization_id') organizationId?: number,
  ): Promise<Pagination<User>> {
    return this.userService.findAll(
      filters,
      organizationId ? organizationId : user.organizationId,
    );
  }

  @ApiQuery({ type: () => PartialType(BaseFilterDto) })
  @Get('invitees')
  async getInvites(
    @ExtractUser() user: User,
    @Query() filters: Partial<BaseFilterDto>,
  ): Promise<User[]> {
    return this.userService.getInvitedUsers(filters, user.organizationId);
  }

  @ApiQuery({ name: 'filters', type: DownloadFiltersDto })
  @ApiQuery({ name: 'organization_id', type: Number })
  @Get('download')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="Utilizatori.xlsx"')
  async downloadUsers(
    @ExtractUser() user: User,
    @Query() filters: DownloadFiltersDto,
    @Query('organization_id') organizationId?: number,
  ): Promise<StreamableFile> {
    return this.userService.getUsersForDownload(
      filters,
      organizationId ? organizationId : user.organizationId,
    );
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async getOne(
    @Param('id') userId: number,
    @ExtractUser() user: User,
  ): Promise<User> {
    return this.userService.getById(userId);
  }

  @ApiParam({ name: 'id', type: Number })
  @Patch(':id/resend-invite')
  async resendInvite(@Param('id') id: number): Promise<void> {
    return this.userService.resendUserInvite(id);
  }

  @ApiBody({ type: Number, isArray: true })
  @Patch('restrict')
  restrict(
    @Body(new ParseArrayPipe({ items: Number }))
    ids: number[],
    @ExtractUser() user: User,
  ) {
    return this.userService.restrictAccess(ids, user.organizationId);
  }

  @ApiBody({ type: Number, isArray: true })
  @Patch('activate')
  restore(
    @Body(new ParseArrayPipe({ items: Number }))
    ids: number[],
    @ExtractUser() user: User,
  ) {
    return this.userService.restoreAccess(ids, user.organizationId);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async update(
    @Param('id') userId: number,
    @Body() body: UpdateUserDto,
    @ExtractUser() user: User,
  ): Promise<User> {
    return this.userService.updateById(userId, body, user.organizationId);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id') id: number, @ExtractUser() user: User) {
    return this.userService.removeById(id, user.organizationId);
  }
}
