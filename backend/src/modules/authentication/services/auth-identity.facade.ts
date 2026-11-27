import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  AuthProvider,
  AuthTokenForm,
  AuthTokenType,
} from '../enums/auth.enums';
import {
  CreateAuthIdentityOptions,
  FindAuthIdentityOptions,
  IAuthIdentityModel,
  UpdateAuthIdentityOptions,
  LoginState,
  UpsertAuthIdentityResult,
} from '../models/auth-identity.model';
import {
  CreateAuthIdentityProviderOptions,
  IAuthIdentityProviderModel,
} from '../models/auth-identity-provider.model';
import {
  CreateAuthTokenOptions,
  IAuthTokenModel,
} from '../models/auth-token.model';
import {
  CreateRefreshTokenOptions,
  IRefreshTokenModel,
} from '../models/refresh-token.model';
import { AuthIdentityRepository } from '../repositories/auth-identity.repository';
import { AuthIdentityProviderRepository } from '../repositories/auth-identity-provider.repository';
import { AuthTokenRepository } from '../repositories/auth-token.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

// The only class other modules import from auth persistence. It also owns the lockout rule.
@Injectable()
export class AuthIdentityFacade {
  constructor(
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authIdentityProviderRepository: AuthIdentityProviderRepository,
  ) {}

  // Identities

  public async findIdentity(
    options: FindAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityModel> {
    return this.authIdentityRepository.find(options, manager);
  }

  public async createIdentity(
    options: CreateAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityModel> {
    return this.authIdentityRepository.create(options, manager);
  }

  public async updateIdentity(
    id: string,
    options: UpdateAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityModel> {
    return this.authIdentityRepository.update(id, options, manager);
  }

  public async upsertIdentity(
    options: CreateAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<UpsertAuthIdentityResult> {
    return this.authIdentityRepository.upsert(options, manager);
  }

  public async findLoginState(identityId: string): Promise<LoginState> {
    return this.authIdentityRepository.findLoginState(identityId);
  }

  public async deleteByUserId(
    userId: number,
    manager?: EntityManager,
  ): Promise<number> {
    return this.authIdentityRepository.deleteByUserId(userId, manager);
  }

  // One-time tokens

  public async createToken(
    options: CreateAuthTokenOptions,
    manager?: EntityManager,
  ): Promise<IAuthTokenModel> {
    return this.authTokenRepository.create(options, manager);
  }

  public async findTokenByHash(tokenHash: string): Promise<IAuthTokenModel> {
    return this.authTokenRepository.findByHash(tokenHash);
  }

  public async findAnyTokenByHash(tokenHash: string): Promise<IAuthTokenModel> {
    return this.authTokenRepository.findAnyByHash(tokenHash);
  }

  public async findLiveToken(
    identityId: string,
    type: AuthTokenType,
    form?: AuthTokenForm,
  ): Promise<IAuthTokenModel> {
    return this.authTokenRepository.findLiveToken(identityId, type, form);
  }

  public async replaceLiveTokens(
    identityId: string,
    types: AuthTokenType[],
    manager?: EntityManager,
  ): Promise<number> {
    return this.authTokenRepository.replaceLiveTokens(
      identityId,
      types,
      manager,
    );
  }

  public async consumeToken(
    id: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.authTokenRepository.consume(id, manager);
  }

  public async findLatestToken(
    identityId: string,
    type: AuthTokenType,
  ): Promise<IAuthTokenModel> {
    return this.authTokenRepository.findLatest(identityId, type);
  }

  public async incrementTokenAttempts(id: string): Promise<number> {
    return this.authTokenRepository.incrementAttempts(id);
  }

  public async claimTokenAttempt(id: string, max: number): Promise<number> {
    return this.authTokenRepository.claimAttempt(id, max);
  }

  public async deleteTokensEndedBefore(date: Date): Promise<number> {
    return this.authTokenRepository.deleteEndedBefore(date);
  }

  // Sessions (refresh tokens)

  // Every new session is a login (link or code), so lastLoginAt is recorded here rather than in each use case. Refresh rotations do not pass here.
  public async createSession(
    options: CreateRefreshTokenOptions,
    manager?: EntityManager,
  ): Promise<IRefreshTokenModel> {
    const session = await this.refreshTokenRepository.create(options, manager);
    await this.authIdentityRepository.update(
      options.identityId,
      { lastLoginAt: new Date() },
      manager,
    );
    return session;
  }

  public async findSessionByHash(
    tokenHash: string,
  ): Promise<IRefreshTokenModel> {
    return this.refreshTokenRepository.findSessionByHash(tokenHash);
  }

  public async findSessionByPreviousHash(
    previousHash: string,
  ): Promise<IRefreshTokenModel> {
    return this.refreshTokenRepository.findSessionByPreviousHash(previousHash);
  }

  public async rotateSession(
    id: string,
    currentTokenHash: string,
    newTokenHash: string,
    expiresAt: Date,
    manager?: EntityManager,
  ): Promise<IRefreshTokenModel> {
    return this.refreshTokenRepository.rotate(
      id,
      currentTokenHash,
      newTokenHash,
      expiresAt,
      manager,
    );
  }

  public async revokeSession(
    id: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.refreshTokenRepository.revoke(id, manager);
  }

  public async revokeAllSessions(
    identityId: string,
    exceptSessionId?: string,
    manager?: EntityManager,
  ): Promise<number> {
    return this.refreshTokenRepository.revokeAllForIdentity(
      identityId,
      exceptSessionId,
      manager,
    );
  }

  public async deleteSessionsExpiredOrRevokedBefore(
    expiredBefore: Date,
    revokedBefore?: Date,
  ): Promise<number> {
    return this.refreshTokenRepository.deleteExpiredOrRevokedBefore(
      expiredBefore,
      revokedBefore,
    );
  }

  // Provider links (only if Google login is added)

  public async findProviderLink(
    provider: AuthProvider,
    subject: string,
  ): Promise<IAuthIdentityProviderModel> {
    return this.authIdentityProviderRepository.findByProvider(
      provider,
      subject,
    );
  }

  public async linkProvider(
    options: CreateAuthIdentityProviderOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityProviderModel> {
    return this.authIdentityProviderRepository.linkProvider(options, manager);
  }
}
