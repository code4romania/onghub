import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('imloggedin')
  @UseGuards(AuthGuard('jwt'))
  async imloggedin(@Request() req) {
    return 'OK';
  }
}
