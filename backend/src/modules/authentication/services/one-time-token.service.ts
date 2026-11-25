import { Injectable } from '@nestjs/common';
import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'crypto';
import { DataSource, EntityManager } from 'typeorm';
import { AuthConfigService } from 'src/common/config/auth.config';
import { AUTH_CODE_MAX_ATTEMPTS, AUTH_TOKEN_TTL_MS } from '../auth.constants';
import { AuthTokenForm, AuthTokenType } from '../enums/auth.enums';
import { AuthErrorCode, AuthException } from '../exceptions/auth.exception';
import { IAuthIdentityModel } from '../models/auth-identity.model';
import { IAuthTokenModel } from '../models/auth-token.model';
import { AuthIdentityFacade } from './auth-identity.facade';

export interface IssueOptions {
  identity: Pick<IAuthIdentityModel, 'id'>;
  type: AuthTokenType;
  /** Where the email goes (user.email); stored for the audit trail. */
  sentTo: string;
  sentById?: number;
  ttlMs?: number;
  /**
   * Opaque value from an httpOnly cookie set when the code was requested.
   * The code only verifies from the same browser (plan 5.2): otherwise an
   * attacker could use a code the victim requested in their own interaction.
   */
  browserNonce?: string;
}

export interface IssuedLinkAndCode {
  link: string; // goes into the email only; never stored or logged
  code: string;
  tokens: IAuthTokenModel[];
}

const LINK_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const CODE_PATTERN = /^\d{6}$/;

/** Consuming one of these ends every other live one for the identity. */
const LOGIN_TYPES = [AuthTokenType.LOGIN, AuthTokenType.INVITE];

@Injectable()
export class OneTimeTokenService {
  constructor(
    private readonly authIdentityFacade: AuthIdentityFacade,
    private readonly authConfig: AuthConfigService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * One request, one email with both a link and a 6-digit code (NGO Hub
   * difference from VIC web). Ends the identity's live tokens of this type
   * and stores the two new ones in one transaction.
   */
  public async issueLinkAndCode(
    options: IssueOptions,
    manager?: EntityManager,
  ): Promise<IssuedLinkAndCode> {
    const { identity, type } = options;
    const link = randomBytes(32).toString('base64url');
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const expiresAt = new Date(
      Date.now() + (options.ttlMs ?? this.defaultTtl(type)),
    );
    const base = {
      identityId: identity.id,
      type,
      expiresAt,
      sentTo: options.sentTo,
      sentById: options.sentById,
    };

    const run = async (m: EntityManager): Promise<IAuthTokenModel[]> => {
      await this.authIdentityFacade.replaceLiveTokens(identity.id, [type], m);
      return [
        await this.authIdentityFacade.createToken(
          {
            ...base,
            form: AuthTokenForm.LINK,
            tokenHash: this.hashLink(type, link),
          },
          m,
        ),
        await this.authIdentityFacade.createToken(
          {
            ...base,
            form: AuthTokenForm.CODE,
            tokenHash: this.hashCode(
              identity.id,
              type,
              code,
              options.browserNonce,
            ),
          },
          m,
        ),
      ];
    };

    const tokens = manager
      ? await run(manager)
      : await this.dataSource.transaction(run);
    return { link, code, tokens };
  }

  /** The live link row with its identity, or null. Changes nothing (GET never consumes). */
  public async peekLink(
    secret: string,
    type?: AuthTokenType,
  ): Promise<IAuthTokenModel> {
    return this.findLink(secret, type, (hash) =>
      this.authIdentityFacade.findTokenByHash(hash),
    );
  }

  /** The link row in any state, for token info and resend. */
  public async findAnyByLink(secret: string): Promise<IAuthTokenModel> {
    return this.findLink(secret, undefined, (hash) =>
      this.authIdentityFacade.findAnyTokenByHash(hash),
    );
  }

  /**
   * Returns the live code row when the code matches. Every try first takes one
   * of the code's attempts atomically, so parallel requests cannot compare more
   * than five codes. Mismatch → AUTH_015; the fifth ends the code (AUTH_006);
   * no live code → AUTH_005. A code bound to a browser only matches with the
   * same nonce.
   */
  public async verifyCode(
    identity: Pick<IAuthIdentityModel, 'id'>,
    type: AuthTokenType,
    code: string,
    browserNonce?: string,
  ): Promise<IAuthTokenModel> {
    const token = await this.authIdentityFacade.findLiveToken(
      identity.id,
      type,
      AuthTokenForm.CODE,
    );
    if (!token) {
      throw new AuthException(AuthErrorCode.AUTH_005);
    }

    const attempts = await this.authIdentityFacade.claimTokenAttempt(
      token.id,
      AUTH_CODE_MAX_ATTEMPTS,
    );
    if (attempts === null) {
      await this.authIdentityFacade.replaceLiveTokens(identity.id, [type]);
      throw new AuthException(AuthErrorCode.AUTH_006);
    }

    const valid = CODE_PATTERN.test(code ?? '');
    const expected = Buffer.from(token.tokenHash, 'hex');
    const actual = Buffer.from(
      this.hashCode(identity.id, type, valid ? code : '', browserNonce),
      'hex',
    );
    if (
      valid &&
      expected.length === actual.length &&
      timingSafeEqual(expected, actual)
    ) {
      return token;
    }

    if (attempts >= AUTH_CODE_MAX_ATTEMPTS) {
      await this.authIdentityFacade.replaceLiveTokens(identity.id, [type]);
      throw new AuthException(AuthErrorCode.AUTH_006);
    }
    throw new AuthException(AuthErrorCode.AUTH_015);
  }

  /** Marks the token used in the caller's transaction; AUTH_005 if another request used it first. */
  public async consume(
    token: Pick<IAuthTokenModel, 'id' | 'identityId' | 'type'>,
    manager?: EntityManager,
  ): Promise<void> {
    const consumed = await this.authIdentityFacade.consumeToken(
      token.id,
      manager,
    );
    if (!consumed) {
      throw new AuthException(AuthErrorCode.AUTH_005);
    }
    if (LOGIN_TYPES.includes(token.type)) {
      await this.authIdentityFacade.replaceLiveTokens(
        token.identityId,
        LOGIN_TYPES,
        manager,
      );
    }
  }

  /** ana@example.ro → a•••@example.ro, elena@example.ro → e•••a@example.ro */
  public maskEmail(email: string): string {
    const [local, domain] = (email ?? '').split('@');
    if (!local || !domain) return '•••';
    return local.length > 3
      ? `${local[0]}•••${local[local.length - 1]}@${domain}`
      : `${local[0]}•••@${domain}`;
  }

  /** A new random value for the browser-binding cookie. */
  public newBrowserNonce(): string {
    return randomBytes(32).toString('base64url');
  }

  /** The link hash is bound to the type only, so a link can be looked up by its hash. */
  private hashLink(type: AuthTokenType, secret: string): string {
    return this.hmac(`${type}:${secret}`);
  }

  /**
   * Codes are short, so their hash is bound to the identity (the same digits
   * never match another person) and, when given, to the requesting browser.
   */
  private hashCode(
    identityId: string,
    type: AuthTokenType,
    code: string,
    browserNonce?: string,
  ): string {
    const binding = browserNonce
      ? createHash('sha256').update(browserNonce).digest('hex')
      : '';
    return this.hmac(`${identityId}:${type}:${binding}:${code}`);
  }

  private hmac(value: string): string {
    return createHmac('sha256', this.authConfig.authTokenKey)
      .update(value)
      .digest('hex');
  }

  private async findLink(
    secret: string,
    type: AuthTokenType | undefined,
    lookup: (hash: string) => Promise<IAuthTokenModel>,
  ): Promise<IAuthTokenModel> {
    if (typeof secret !== 'string' || !LINK_PATTERN.test(secret)) return null;
    const types = type ? [type] : Object.values(AuthTokenType);
    for (const candidate of types) {
      const token = await lookup(this.hashLink(candidate, secret));
      if (token && token.form === AuthTokenForm.LINK) return token;
    }
    return null;
  }

  private defaultTtl(type: AuthTokenType): number {
    switch (type) {
      case AuthTokenType.LOGIN:
        return AUTH_TOKEN_TTL_MS.LOGIN;
      case AuthTokenType.INVITE:
        return AUTH_TOKEN_TTL_MS.INVITE;
      case AuthTokenType.VERIFY_EMAIL:
        return AUTH_TOKEN_TTL_MS.VERIFY_EMAIL;
    }
  }
}
