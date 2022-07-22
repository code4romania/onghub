import { Controller, Get, Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('imloggedin')
  async imloggedin(@Request() req) {
    return 'OK';
  }
}
