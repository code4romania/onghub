import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { NomenclaturesService } from '../services';

@Public()
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
