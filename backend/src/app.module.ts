import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { RateLimiterConfigService } from './common/config/rate-limiter-config.service';
import { TypeOrmConfigService } from './common/config/typeorm-config.service';
import { validate } from './env.validation';
import { OrganizationModule } from './organization/organization.module';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ThrottlerModule.forRootAsync({
      useClass: RateLimiterConfigService,
    }),
    OrganizationModule,
    EmailModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // TODO: move this when required
    },
  ],
})
export class AppModule {}
