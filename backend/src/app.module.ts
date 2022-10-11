import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { UserStatusGuard } from './common/guards/user-status.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { RawBodyMiddleware } from './shared/middlewares/raw-body.middleware';
import { JsonBodyMiddleware } from './shared/middlewares/json-body.middlware';
import { PublicAPIModule } from './modules/_publicAPI/public-api.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

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
    UserModule,
    AuthenticationModule,
    ApplicationModule,
    OrganizationModule,
    PublicAPIModule,
    StatisticsModule,

    // Other modules
    SharedModule,
    MailModule,
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
    {
      // Global guard for all routes, doesn't require @UseGuards() in each Controller https://docs.nestjs.com/security/authentication#enable-authentication-globally
      provide: APP_GUARD,
      useClass: UserStatusGuard,
    },
    {
      // Global guard for all routes, doesn't require @UseGuards() in each Controller https://docs.nestjs.com/security/authentication#enable-authentication-globally
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes('api/*')
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
