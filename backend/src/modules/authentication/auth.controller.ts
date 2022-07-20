import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('imloggedin')
  @UseGuards(AuthGuard('jwt'))
  async imloggedin(@Request() req) {
    return 'OK';
  }
}
