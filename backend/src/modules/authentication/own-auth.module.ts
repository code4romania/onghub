import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
@Module({
  imports: [
    AuthPersistenceModule,
    MailModule,
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
  ],
  exports: [
    AuthConfigService,
    AuthPersistenceModule,
    OneTimeTokenService,
    SessionService,
    AuthRateLimitService,
    AuthMailerService,
    UserLoginLifecycle,
  ],
})
export class OwnAuthModule {}
