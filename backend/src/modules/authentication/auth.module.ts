import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConfigService } from 'src/common/config/auth.config';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/services/user.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { OwnAuthModule } from './own-auth.module';
import { OwnAuthController } from './own-auth.controller';
import { OwnLoginService } from './services/own-login.service';
import { AuthIdentityFacade } from './services/auth-identity.facade';
import { OwnJwtStrategy } from './strategies/own-jwt.strategy';

/**
 * Exactly one passport 'jwt' strategy is registered, chosen at boot:
 * NGO Hub's own tokens when own auth is configured, Cognito otherwise. This
 * keeps the branch deployable before the per-environment cutover (phase 3).
 */
export const ACTIVE_JWT_STRATEGY = 'ACTIVE_JWT_STRATEGY';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    OwnAuthModule,
  ],
  controllers: [AuthController, OwnAuthController],
  providers: [
    OwnLoginService,
    {
      provide: ACTIVE_JWT_STRATEGY,
      inject: [AuthConfigService, UserService, AuthIdentityFacade],
      useFactory: (
        config: AuthConfigService,
        users: UserService,
        facade: AuthIdentityFacade,
      ) =>
        config.enabled
          ? new OwnJwtStrategy(config, users, facade)
          : new JwtStrategy(users),
    },
  ],
  exports: [OwnAuthModule],
})
export class AuthenticationModule {}
