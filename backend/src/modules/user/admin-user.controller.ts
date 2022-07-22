import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enums/role.enum';
import { UserService } from './services/user.service';

@Controller('user')
// TODO: add permissions for Admin (SuperAdmin and Admin)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateUserDto) {
    return this.userService.create({
      email: body.email,
      name: body.name,
      phone: body.phone,
      organizationId: body.organizationId,
    });
  }
}
