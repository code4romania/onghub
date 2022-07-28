import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivateUserDto } from './dto/restore-user.dto';
import { RestrictUserDto } from './dto/restrict-user.dto';
import { UserService } from './services/user.service';

@Controller('user')
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
  @Patch(':cognitoId/restrict')
  restrict(@Param() restrictUserDto: RestrictUserDto) {
    return this.userService.restrictAccess(restrictUserDto);
  }

  @Patch(':restrict_multiple')
  restrictBulk(@Param() cognitoIds: string[]) {
    return this.userService.restrictAccessBulk(cognitoIds);
  }

  // TODO: restrict to be called only by Admin/Super-Admin
  @Patch(':cognitoId/activate')
  restore(@Param() activateUserDto: ActivateUserDto) {
    return this.userService.restoreAccess(activateUserDto);
  }

  @Patch(':activate_multiple')
  restoreBulk(@Param() cognitoIds: string[]) {
    return this.userService.restoreAccessBulk(cognitoIds);
  }
}
