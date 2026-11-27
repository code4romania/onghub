import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { EntityManager } from 'typeorm';
import { AuthConfigService } from 'src/common/config/auth.config';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { Role } from 'src/modules/user/enums/role.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { REFRESH_REUSE_GRACE_MS } from '../auth.constants';
import { AuthErrorCode, AuthException } from '../exceptions/auth.exception';
import { IAuthIdentityModel, LoginState } from '../models/auth-identity.model';
import { IRefreshTokenModel } from '../models/refresh-token.model';
import { AuthIdentityFacade } from './auth-identity.facade';

export interface SessionClient {
  userAgent?: string;
  ip?: string;
}

export interface AccessTokenPayload {
  sub: string; // auth_identity id (not user.id: OIDC `sub` is a different thing)
  sid: string; // refresh_token id: the session
}

export interface SessionTokens {
  accessToken: string;
  expiresIn: number; // seconds
  /** Absent when two requests crossed during a rotation: the client keeps its refresh token. */
  refreshToken?: string;
  sessionId: string;
}

/** May this login hold a session? Not RESTRICTED, organization not RESTRICTED. */
export function canHoldSession(state: LoginState | null): boolean {
  return (
    !!state &&
    state.userStatus !== UserStatus.RESTRICTED &&
    state.organizationStatus !== OrganizationStatus.RESTRICTED
  );
}

/** The NGO Hub SPA session (port of VIC's SessionService, web realm only). */
@Injectable()
export class SessionService {
  constructor(
    private readonly authIdentityFacade: AuthIdentityFacade,
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfigService,
  ) {}

  public signAccessToken(
    identity: Pick<IAuthIdentityModel, 'id'>,
    sessionId: string,
  ): string {
    const payload: AccessTokenPayload = { sub: identity.id, sid: sessionId };
    return this.jwtService.sign(payload);
  }

  /**
   * Super admins (plan 5.5) get a shorter session with a fixed end
   * (SUPER_ADMIN_SESSION_HOURS, 12 by default): refreshing never extends it.
   */
  public async createSession(
    identity: Pick<IAuthIdentityModel, 'id'>,
    client: SessionClient = {},
    manager?: EntityManager,
    options: { superAdmin?: boolean } = {},
  ): Promise<SessionTokens> {
    const refreshToken = this.newSecret();
    const session = await this.authIdentityFacade.createSession(
      {
        identityId: identity.id,
        tokenHash: this.hash(refreshToken),
        expiresAt: options.superAdmin
          ? new Date(
              Date.now() +
                this.authConfig.superAdminSessionHours * 60 * 60 * 1000,
            )
          : this.refreshExpiry(),
        userAgent: client.userAgent,
        ip: client.ip,
      },
      manager,
    );
    return this.tokens(identity, session.id, refreshToken);
  }

  /**
   * Exchanges a refresh token for a new pair. Presenting the old one again
   * within 10 s of the rotation (two tabs) returns a new access token only;
   * later it is a replay: the session is revoked and AUTH_008 thrown.
   */
  public async rotate(secret: string): Promise<SessionTokens> {
    if (typeof secret !== 'string' || !secret) {
      throw new AuthException(AuthErrorCode.AUTH_008);
    }
    const hash = this.hash(secret);

    const session = await this.authIdentityFacade.findSessionByHash(hash);
    if (session) {
      this.assertLive(session);
      const state = await this.allowedState(session);
      const identity = state.identity;
      const refreshToken = this.newSecret();
      const rotated = await this.authIdentityFacade.rotateSession(
        session.id,
        hash,
        this.hash(refreshToken),
        // A super admin's session keeps its fixed end; the others slide.
        state.role === Role.SUPER_ADMIN
          ? session.expiresAt
          : this.refreshExpiry(),
      );
      return rotated
        ? this.tokens(identity, session.id, refreshToken)
        : this.tokens(identity, session.id);
    }

    const rotatedAway =
      await this.authIdentityFacade.findSessionByPreviousHash(hash);
    if (!rotatedAway) {
      throw new AuthException(AuthErrorCode.AUTH_008);
    }
    this.assertLive(rotatedAway);

    const withinGrace =
      rotatedAway.rotatedAt &&
      Date.now() - rotatedAway.rotatedAt.getTime() <= REFRESH_REUSE_GRACE_MS;
    if (!withinGrace) {
      await this.authIdentityFacade.revokeSession(rotatedAway.id);
      throw new AuthException(AuthErrorCode.AUTH_008);
    }
    const { identity } = await this.allowedState(rotatedAway);
    return this.tokens(identity, rotatedAway.id);
  }

  public async revoke(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.authIdentityFacade.revokeSession(sessionId, manager);
  }

  /** Logout presents the refresh token itself; an unknown token is ignored. */
  public async revokeByRefreshToken(secret: string): Promise<boolean> {
    if (typeof secret !== 'string' || !secret) return false;
    const session = await this.authIdentityFacade.findSessionByHash(
      this.hash(secret),
    );
    return session ? this.authIdentityFacade.revokeSession(session.id) : false;
  }

  public async revokeAll(
    identityId: string,
    exceptSessionId?: string,
    manager?: EntityManager,
  ): Promise<number> {
    return this.authIdentityFacade.revokeAllSessions(
      identityId,
      exceptSessionId,
      manager,
    );
  }

  private tokens(
    identity: Pick<IAuthIdentityModel, 'id'>,
    sessionId: string,
    refreshToken?: string,
  ): SessionTokens {
    return {
      accessToken: this.signAccessToken(identity, sessionId),
      expiresIn: this.authConfig.accessTokenTtlSeconds,
      ...(refreshToken ? { refreshToken } : {}),
      sessionId,
    };
  }

  private assertLive(session: IRefreshTokenModel): void {
    if (session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw new AuthException(AuthErrorCode.AUTH_008);
    }
  }

  /** A session only refreshes while its user and organization are not restricted. */
  private async allowedState(session: IRefreshTokenModel): Promise<LoginState> {
    const state = await this.authIdentityFacade.findLoginState(
      session.identityId,
    );
    if (!canHoldSession(state)) {
      throw new AuthException(AuthErrorCode.AUTH_008);
    }
    return state;
  }

  private refreshExpiry(): Date {
    return new Date(
      Date.now() + this.authConfig.refreshTtlDays * 24 * 60 * 60 * 1000,
    );
  }

  private newSecret(): string {
    return randomBytes(32).toString('base64url');
  }

  private hash(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }
}
