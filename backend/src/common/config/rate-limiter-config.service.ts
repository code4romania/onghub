import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class RateLimiterConfigService implements ThrottlerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return [{
      limit: +this.configService.get('THROTTLE_LIMIT'),
      ttl: +this.configService.get('THROTTLE_TTL') * 1000, // @radulescuandrew 01-07-2024: Added * 1000 as CacheManager changed seconds to miliseconds 
    }];
  }
}
