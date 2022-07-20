import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../authentication/auth.service';

@Controller('user')
// TODO: add permissions for Admin (SuperAdmin and Admin)
export class AdminUserController {
  constructor(private readonly authService: AuthService) {}

  @Post(':id/disable')
  @UseGuards(AuthGuard('jwt'))
  async disable(@Param('id') username) {
    return this.authService.disableUser(username);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() body: { fullName: string; email: string; phoneNumber: string },
  ) {
    return this.authService.createUser(
      body.fullName,
      body.email,
      body.phoneNumber,
    );
  }
}
