import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration(): BullModuleOptions {
    return {
      // Unset in deployed environments (Bull's default `bull`). Tests set a
      // per-worker prefix so they never take a dev server's jobs.
      prefix: this.configService.get('BULL_PREFIX') || undefined,
      redis: {
        host: this.configService.get('REDIS_HOST'),
        port: +this.configService.get('REDIS_PORT'),
      },
    };
  }
}
