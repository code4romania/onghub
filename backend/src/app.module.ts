import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { PinoLoggerConfig } from './common/config/logging.config';
import { RateLimiterConfigService } from './common/config/rate-limiter-config.service';
import { ThrottlerGuardByIP } from './common/guards/ThrottlerGuardByIP.guard';
import { validate } from './env.validation';
import { MailModule } from './mail/mail.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CacheProviderModule } from './providers/cache/cache-provider.module';
import { DatabaseProviderModule } from './providers/database/database-provider.module';
import { SharedModule } from './shared/shared.module';
import { QueueProviderModule } from './providers/queue/queue-provider.module';
import { ApplicationModule } from './modules/application/application.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/auth.module';
import { JwtAuthGuard } from './modules/authentication/jwt-auth.guard';

@Module({
  imports: [
    // Configuration modules
    LoggerModule.forRoot(PinoLoggerConfig),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    ThrottlerModule.forRootAsync({
      useClass: RateLimiterConfigService,
    }),

    // Providers
    DatabaseProviderModule,
    CacheProviderModule,
    QueueProviderModule,

    // Business modules
    OrganizationModule,
    MailModule,
    SharedModule,
    ApplicationModule,
    UserModule,
    AuthenticationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuardByIP,
    },
    {
      // Global guard for all routes, doesn't require @UseGuards() in each Controller https://docs.nestjs.com/security/authentication#enable-authentication-globally
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
