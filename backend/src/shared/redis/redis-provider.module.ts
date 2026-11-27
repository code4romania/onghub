import {
  Global,
  Inject,
  Injectable,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Injectable()
class RedisShutdown implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    if (this.redis.status === 'end') return;
    try {
      await this.redis.quit();
    } catch {
      this.redis.disconnect();
    }
  }
}

/**
 * A plain ioredis client for counters (auth rate limits) and short-lived
 * state. Every key gets REDIS_KEY_PREFIX (`ngohub:` in deployed envs: Redis is
 * shared with VIC; per-worker `test:<n>:` in specs).
 */
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis =>
        new Redis({
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          keyPrefix: configService.get('REDIS_KEY_PREFIX') || 'ngohub:',
          lazyConnect: false,
        }),
    },
    RedisShutdown,
  ],
  exports: [REDIS_CLIENT],
})
export class RedisProviderModule {}
