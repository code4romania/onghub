import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { NomenclaturesService } from '../services';

@Controller('')
export class SharedController {
  constructor() {}

  @SkipThrottle()
  @Get('health')
  healthCheck() {
    return 'OK';
  }

  @Get('version')
  version() {
    return 'v0.0.2';
  }
}
