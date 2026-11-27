import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from 'src/common/constants/queues.constants';
import {
  AuthMigrationService,
  AuthTransitionProcessor,
} from './services/auth-migration.service';
import { AuthConfigService } from 'src/common/config/auth.config';
import { MailModule } from 'src/mail/mail.module';
import { AuthPersistenceModule } from './auth-persistence.module';
import { AuthMailerService } from './services/auth-mailer.service';
import { AuthRateLimitService } from './services/auth-rate-limit.service';
import { OneTimeTokenService } from './services/one-time-token.service';
import { SessionService } from './services/session.service';
import { UserLoginLifecycle } from './services/user-login-lifecycle.service';

/**
 * Own passwordless auth services (O5), ported from VIC 2.0 without realms.
 * Inert until JWT_PRIVATE_KEY / JWT_PUBLIC_KEY / AUTH_TOKEN_KEY are set.
 */
import { SuperAdminService } from './services/super-admin.service';
@Module({
  imports: [
    AuthPersistenceModule,
    MailModule,
    // At most 5 transition emails a second once released.
    BullModule.registerQueue({
      name: QUEUES.AUTH_TRANSITION,
      limiter: { max: 5, duration: 1000 },
    }),
    JwtModule.registerAsync({
      extraProviders: [AuthConfigService],
      useClass: AuthConfigService,
    }),
  ],
  providers: [
    AuthConfigService,
    OneTimeTokenService,
    SessionService,
    AuthRateLimitService,
    AuthMailerService,
    UserLoginLifecycle,
    AuthMigrationService,
    AuthTransitionProcessor,
    SuperAdminService,
  ],
  exports: [
    AuthConfigService,
    AuthPersistenceModule,
    OneTimeTokenService,
    SessionService,
    AuthRateLimitService,
    AuthMailerService,
    UserLoginLifecycle,
    AuthMigrationService,
    SuperAdminService,
  ],
})
export class OwnAuthModule {}
