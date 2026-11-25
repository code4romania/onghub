import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthIdentityEntity } from './entities/auth-identity.entity';
import { AuthTokenEntity } from './entities/auth-token.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { AuthIdentityProviderEntity } from './entities/auth-identity-provider.entity';
import { OidcClientEntity } from './entities/oidc-client.entity';
import { OidcPayloadEntity } from './entities/oidc-payload.entity';
import { AuthEventEntity } from './entities/auth-event.entity';
import { AuthIdentityRepository } from './repositories/auth-identity.repository';
import { AuthTokenRepository } from './repositories/auth-token.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { AuthIdentityProviderRepository } from './repositories/auth-identity-provider.repository';
import { AuthIdentityFacade } from './services/auth-identity.facade';

/**
 * Persistence for own auth (O4). Other modules only use AuthIdentityFacade.
 * OIDC client/payload and auth_event entities are registered here; their
 * adapters arrive with O10 and O14.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthIdentityEntity,
      AuthTokenEntity,
      RefreshTokenEntity,
      AuthIdentityProviderEntity,
      OidcClientEntity,
      OidcPayloadEntity,
      AuthEventEntity,
    ]),
  ],
  providers: [
    AuthIdentityRepository,
    AuthTokenRepository,
    RefreshTokenRepository,
    AuthIdentityProviderRepository,
    AuthIdentityFacade,
  ],
  exports: [AuthIdentityFacade, TypeOrmModule],
})
export class AuthPersistenceModule {}
