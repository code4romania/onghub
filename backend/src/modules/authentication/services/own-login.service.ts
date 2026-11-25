import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthTokenType } from '../enums/auth.enums';
import { AuthErrorCode, AuthException } from '../exceptions/auth.exception';
import { LoginState } from '../models/auth-identity.model';
import { IAuthTokenModel } from '../models/auth-token.model';
import { AuthIdentityFacade } from './auth-identity.facade';
import { AuthMailerService } from './auth-mailer.service';
import { AuthRateLimitService } from './auth-rate-limit.service';
import { OneTimeTokenService } from './one-time-token.service';
import {
  canHoldSession,
  SessionClient,
  SessionService,
  SessionTokens,
} from './session.service';

export interface RequestLoginResult {
  maskedEmail: string;
}

export interface TokenInfo {
  type: AuthTokenType;
  maskedEmail: string;
}

const LOGIN_LINK_TYPES = [AuthTokenType.LOGIN, AuthTokenType.INVITE];

/** Runs fn, ignoring only a rate-limit refusal: the caller answers the same either way. */
async function swallowRateLimit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (error) {
    if (error instanceof AuthException && error.code === AuthErrorCode.AUTH_010)
      return;
    throw error;
  }
}

/**
 * NGO Hub's passwordless login (O6), the use cases of VIC 2.0's web realm in
 * one service. Requests always answer the same, so the API cannot tell who
 * has an account.
 */
@Injectable()
export class OwnLoginService {
  constructor(
    private readonly facade: AuthIdentityFacade,
    private readonly tokens: OneTimeTokenService,
    private readonly sessions: SessionService,
    private readonly rateLimit: AuthRateLimitService,
    private readonly mailer: AuthMailerService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Emails a link and a code (15 minutes) to an existing, non-restricted user.
   * Users created before the migration get their identity on the fly.
   * `browserNonce` comes from an httpOnly cookie the controller sets; the code
   * only works from that browser.
   */
  async requestLogin(
    email: string,
    browserNonce: string,
    clientName?: string,
  ): Promise<RequestLoginResult> {
    const maskedEmail = this.tokens.maskEmail(email);

    await swallowRateLimit(async () => {
      // Before the lookup, so known and unknown addresses are limited alike.
      await this.rateLimit.assertCanIssueLogin(email);

      const state = await this.findOrCreateState(email);
      if (!canHoldSession(state)) return;

      const issued = await this.tokens.issueLinkAndCode({
        identity: state.identity,
        type: AuthTokenType.LOGIN,
        sentTo: state.email,
        browserNonce,
      });
      await this.mailer.sendLogin({
        to: state.email,
        link: issued.link,
        code: issued.code,
        clientName,
      });
    });

    return { maskedEmail };
  }

  /** The /login/link page: a login link or an invite. Consumes it and starts a session. */
  async loginWithLink(
    secret: string,
    client: SessionClient = {},
    ip?: string,
  ): Promise<SessionTokens> {
    await this.rateLimit.assertCanVerify(ip);
    const token = await this.tokens.peekLink(secret);
    if (!token || !LOGIN_LINK_TYPES.includes(token.type)) {
      throw new AuthException(AuthErrorCode.AUTH_005);
    }
    return this.complete(token, client);
  }

  /** Email + the 6-digit code, from the browser that asked for it. */
  async loginWithCode(
    email: string,
    code: string,
    browserNonce: string,
    client: SessionClient = {},
    ip?: string,
  ): Promise<SessionTokens> {
    await this.rateLimit.assertCanVerify(ip);
    const identity = await this.facade.findIdentity({ email });
    if (!identity) throw new AuthException(AuthErrorCode.AUTH_005);

    let token: IAuthTokenModel;
    try {
      token = await this.tokens.verifyCode(
        identity,
        AuthTokenType.LOGIN,
        code,
        browserNonce,
      );
    } catch (error) {
      // Anonymous callers must not learn whether this email has a live code.
      if (
        error instanceof AuthException &&
        error.code === AuthErrorCode.AUTH_015
      ) {
        throw new AuthException(AuthErrorCode.AUTH_005);
      }
      throw error;
    }
    return this.complete(token, client);
  }

  /** What the link page shows before anything is clicked. Never consumes. */
  async tokenInfo(secret: string): Promise<TokenInfo> {
    const token = await this.tokens.peekLink(secret);
    if (!token) throw new AuthException(AuthErrorCode.AUTH_005);
    const state = await this.facade.findLoginState(token.identityId);
    if (!state) throw new AuthException(AuthErrorCode.AUTH_005);
    return {
      type: token.type,
      maskedEmail: this.tokens.maskEmail(state.email),
    };
  }

  /** "Send me a new link" from an expired or used link page. Always silent. */
  async resend(secret: string): Promise<void> {
    const old = await this.tokens.findAnyByLink(secret);
    if (!old || !LOGIN_LINK_TYPES.includes(old.type)) return;
    const state = await this.facade.findLoginState(old.identityId);
    if (!canHoldSession(state)) return;

    // An invite is done once the person has logged in: send a login instead.
    const type =
      old.type === AuthTokenType.INVITE &&
      state.userStatus === UserStatus.PENDING
        ? AuthTokenType.INVITE
        : AuthTokenType.LOGIN;

    await swallowRateLimit(async () => {
      await this.rateLimit.assertCanIssueLogin(state.email);
      const issued = await this.tokens.issueLinkAndCode({
        identity: state.identity,
        type,
        sentTo: state.email,
        sentById: old.sentById,
      });
      if (type === AuthTokenType.INVITE) {
        await this.mailer.sendInvite(state.email, issued.link, issued.code);
      } else {
        await this.mailer.sendLogin({
          to: state.email,
          link: issued.link,
          code: issued.code,
        });
      }
    });
  }

  async refresh(refreshToken: string): Promise<SessionTokens> {
    return this.sessions.rotate(refreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessions.revokeByRefreshToken(refreshToken);
  }

  /**
   * In one transaction: uses the token (the email is now proven), marks the
   * email verified, turns a PENDING user ACTIVE (moved here from the JWT
   * strategy), and starts the session. Restricted users/organizations stop
   * before anything is used (AUTH_004).
   */
  private async complete(
    token: IAuthTokenModel,
    client: SessionClient,
  ): Promise<SessionTokens> {
    const state = await this.facade.findLoginState(token.identityId);
    if (!state) throw new AuthException(AuthErrorCode.AUTH_005);
    if (!canHoldSession(state)) throw new AuthException(AuthErrorCode.AUTH_004);

    return this.dataSource.transaction(async (manager) => {
      await this.tokens.consume(token, manager);
      await this.facade.updateIdentity(
        state.identity.id,
        { emailVerifiedAt: state.identity.emailVerifiedAt ?? new Date() },
        manager,
      );
      if (state.userStatus === UserStatus.PENDING) {
        // Load + save (not update()): the user-history subscriber needs the entity.
        const users = manager.getRepository(User);
        const user = await users.findOneBy({ id: state.userId });
        user.status = UserStatus.ACTIVE;
        await users.save(user);
      }
      return this.sessions.createSession(state.identity, client, manager);
    });
  }

  private async findOrCreateState(email: string): Promise<LoginState | null> {
    const identity = await this.facade.findIdentity({ email });
    if (identity) return this.facade.findLoginState(identity.id);

    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('lower(user.email) = :email', {
        email: (email ?? '').trim().toLowerCase(),
      })
      .getOne();
    if (!user?.id) return null;

    const { identity: created } = await this.facade.upsertIdentity({
      userId: user.id,
      legacyCognitoUsername: user.cognitoId ?? undefined,
    });
    return this.facade.findLoginState(created.id);
  }
}
