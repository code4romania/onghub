import {
  Body,
  Controller,
  Delete,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivateUserDto } from './dto/restore-user.dto';
import { RestrictUserDto } from './dto/restrict-user.dto';
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
    return this.userService.create({
      email: body.email,
      name: body.name,
      phone: body.phone,
      organizationId: body.organizationId,
    });
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

  // TODO: restrict to be called only by Admin/Super-Admin
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.removeById(id);
  }
}
