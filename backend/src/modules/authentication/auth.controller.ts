import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authenticateRequest: { name: string; password: string }) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('register')
  async register(
    @Body() registerRequest: { name: string; password: string; email: string },
  ) {
    return await this.authService.registerUser(registerRequest);
  }

  @Get('imloggedin')
  @UseGuards(AuthGuard('jwt'))
  async imloggedin(@Request() req) {
    console.log(req.user);
    return this.authService.getUserData(req.user['username']);
  }
}
