import {
  Body,
  Controller,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
  @ApiBody({ type: RestrictUserDto, isArray: true })
  @Patch('restrict')
  restrict(
    @Body(new ParseArrayPipe({ items: RestrictUserDto }))
    cognitoIds: RestrictUserDto[],
  ) {
    return this.userService.restrictAccess(cognitoIds);
  }

  // TODO: restrict to be called only by Admin/Super-Admin
  @ApiBody({ type: ActivateUserDto, isArray: true })
  @Patch('activate')
  restore(
    @Body(new ParseArrayPipe({ items: ActivateUserDto }))
    cognitoIds: ActivateUserDto[],
  ) {
    return this.userService.restoreAccess(cognitoIds);
  }
}
