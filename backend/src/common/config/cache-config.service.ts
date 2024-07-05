import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import {
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';


@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      isGlobal: true,
      store: redisStore,
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      ttl: this.configService.get('CACHE_TTL') * 1000, // @radulescuandrew 01-07-2024: Added * 1000 as CacheManager changed seconds to miliseconds 
    };
  }
}
