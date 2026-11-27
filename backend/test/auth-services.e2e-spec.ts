import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { JWT_AUDIENCE, JWT_ISSUER } from 'src/common/config/auth.config';
import { AuthTokenType } from 'src/modules/authentication/enums/auth.enums';
import { AuthErrorCode } from 'src/modules/authentication/exceptions/auth.exception';
import { AuthIdentityFacade } from 'src/modules/authentication/services/auth-identity.facade';
import { AuthMailerService } from 'src/modules/authentication/services/auth-mailer.service';
import { AuthRateLimitService } from 'src/modules/authentication/services/auth-rate-limit.service';
import { OneTimeTokenService } from 'src/modules/authentication/services/one-time-token.service';
import { SessionService } from 'src/modules/authentication/services/session.service';
import {
  openSecret,
  openSecretWithAny,
  sealSecret,
} from 'src/modules/authentication/services/secret-box';
import { randomBytes } from 'crypto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/shared/redis/redis-provider.module';
import { createTestApp, TestApp } from './utils/test-app';
import { truncate } from './utils/test-data-source';

const code = (fn: () => Promise<unknown>) =>
  fn().then(
    () => 'resolved',
    (e) => e?.code ?? e?.message,
  );

describe('own auth services (O5)', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let facade: AuthIdentityFacade;
  let tokens: OneTimeTokenService;
  let sessions: SessionService;
  let limits: AuthRateLimitService;

  const seed = async (
    email: string,
    opts: { userStatus?: string; orgStatus?: string } = {},
  ) => {
    let orgId = null;
    if (opts.orgStatus) {
      [{ id: orgId }] = await ds.query(
        `INSERT INTO organization (status) VALUES ($1) RETURNING id`,
        [opts.orgStatus],
      );
    }
    const [{ id: userId }] = await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id) VALUES ('T', $1, '+40700000000', 'admin', $2, $3) RETURNING id`,
      [email, opts.userStatus ?? 'active', orgId],
    );
    const identity = await facade.createIdentity({ userId });
    return { userId, orgId, identity };
  };

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
    facade = testApp.app.get(AuthIdentityFacade);
    tokens = testApp.app.get(OneTimeTokenService);
    sessions = testApp.app.get(SessionService);
    limits = testApp.app.get(AuthRateLimitService);
  });

  afterAll(() => testApp?.close());

  beforeEach(async () => {
    testApp.mailbox.clear();
    await testApp.flushRedis();
    await truncate(ds, ['auth_identity', 'user', 'organization']);
  });

  describe('one-time tokens', () => {
    it('one request issues a link and a code; the link peeks without consuming', async () => {
      const { identity } = await seed('a@ong.ro');
      const issued = await tokens.issueLinkAndCode({
        identity,
        type: AuthTokenType.LOGIN,
        sentTo: 'a@ong.ro',
      });
      expect(issued.link).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(issued.code).toMatch(/^\d{6}$/);

      const peeked = await tokens.peekLink(issued.link);
      expect(peeked?.identityId).toBe(identity.id);
      expect(await tokens.peekLink(issued.link)).not.toBeNull(); // still live

      await tokens.consume(peeked);
      expect(await tokens.peekLink(issued.link)).toBeNull();
      // Consuming the link ends the code from the same email too.
      expect(
        await code(() =>
          tokens.verifyCode(identity, AuthTokenType.LOGIN, issued.code),
        ),
      ).toBe(AuthErrorCode.AUTH_005);
    });

    it('a code bound to a browser only verifies with the same nonce', async () => {
      const { identity } = await seed('b@ong.ro');
      const nonce = tokens.newBrowserNonce();
      const issued = await tokens.issueLinkAndCode({
        identity,
        type: AuthTokenType.LOGIN,
        sentTo: 'b@ong.ro',
        browserNonce: nonce,
      });

      expect(
        await code(() =>
          tokens.verifyCode(identity, AuthTokenType.LOGIN, issued.code),
        ),
      ).toBe(AuthErrorCode.AUTH_015);
      expect(
        await code(() =>
          tokens.verifyCode(
            identity,
            AuthTokenType.LOGIN,
            issued.code,
            tokens.newBrowserNonce(),
          ),
        ),
      ).toBe(AuthErrorCode.AUTH_015);
      const ok = await tokens.verifyCode(
        identity,
        AuthTokenType.LOGIN,
        issued.code,
        nonce,
      );
      expect(ok.identityId).toBe(identity.id);
    });

    it('the fifth wrong code ends it, even under parallel guesses', async () => {
      const { identity } = await seed('c@ong.ro');
      const issued = await tokens.issueLinkAndCode({
        identity,
        type: AuthTokenType.LOGIN,
        sentTo: 'c@ong.ro',
      });
      const wrong = issued.code === '000000' ? '111111' : '000000';

      const results = await Promise.all(
        Array.from({ length: 8 }, () =>
          code(() => tokens.verifyCode(identity, AuthTokenType.LOGIN, wrong)),
        ),
      );
      expect(results.filter((r) => r === AuthErrorCode.AUTH_015)).toHaveLength(
        4,
      );
      expect(
        results.filter((r) => r === AuthErrorCode.AUTH_006).length,
      ).toBeGreaterThanOrEqual(1);
      // The right code no longer works.
      expect(
        await code(() =>
          tokens.verifyCode(identity, AuthTokenType.LOGIN, issued.code),
        ),
      ).toBe(AuthErrorCode.AUTH_005);
    });

    it('a new request replaces the previous link and code', async () => {
      const { identity } = await seed('d@ong.ro');
      const first = await tokens.issueLinkAndCode({
        identity,
        type: AuthTokenType.LOGIN,
        sentTo: 'd@ong.ro',
      });
      await tokens.issueLinkAndCode({
        identity,
        type: AuthTokenType.LOGIN,
        sentTo: 'd@ong.ro',
      });
      expect(await tokens.peekLink(first.link)).toBeNull();
      expect((await tokens.findAnyByLink(first.link))?.replacedAt).toBeTruthy();
    });

    it('masks emails', () => {
      expect(tokens.maskEmail('ana@ong.ro')).toBe('a•••@ong.ro');
      expect(tokens.maskEmail('elena@ong.ro')).toBe('e•••a@ong.ro');
    });
  });

  describe('sessions', () => {
    it('access token is RS256 with iss/aud of NGO Hub and sub = identity', async () => {
      const { identity } = await seed('e@ong.ro');
      const s = await sessions.createSession(identity);
      const payload = testApp.app.get(JwtService).verify(s.accessToken);
      expect(payload).toMatchObject({
        sub: identity.id,
        sid: s.sessionId,
        iss: JWT_ISSUER,
        aud: JWT_AUDIENCE,
      });
      const header = JSON.parse(
        Buffer.from(s.accessToken.split('.')[0], 'base64url').toString(),
      );
      expect(header).toMatchObject({ alg: 'RS256', kid: 'test' });
    });

    it('rotates; replay after the grace window revokes the session', async () => {
      const { identity } = await seed('f@ong.ro');
      const s = await sessions.createSession(identity);
      const r1 = await sessions.rotate(s.refreshToken);
      expect(r1.refreshToken).toBeDefined();

      // Within 10 s the old token yields an access token only (two tabs).
      const crossed = await sessions.rotate(s.refreshToken);
      expect(crossed.refreshToken).toBeUndefined();

      await ds.query(
        `UPDATE refresh_token SET rotated_at = now() - interval '1 minute'`,
      );
      expect(await code(() => sessions.rotate(s.refreshToken))).toBe(
        AuthErrorCode.AUTH_008,
      );
      // The whole session is gone, including the newest token.
      expect(await code(() => sessions.rotate(r1.refreshToken))).toBe(
        AuthErrorCode.AUTH_008,
      );
    });

    it('a restricted user or organization cannot refresh', async () => {
      const u = await seed('g@ong.ro');
      const s1 = await sessions.createSession(u.identity);
      await ds.query(`UPDATE "user" SET status = 'restricted' WHERE id = $1`, [
        u.userId,
      ]);
      expect(await code(() => sessions.rotate(s1.refreshToken))).toBe(
        AuthErrorCode.AUTH_008,
      );

      const o = await seed('h@ong.ro', { orgStatus: 'active' });
      const s2 = await sessions.createSession(o.identity);
      await ds.query(
        `UPDATE organization SET status = 'restricted' WHERE id = $1`,
        [o.orgId],
      );
      expect(await code(() => sessions.rotate(s2.refreshToken))).toBe(
        AuthErrorCode.AUTH_008,
      );
    });

    it('logout by refresh token; unknown token ignored', async () => {
      const { identity } = await seed('i@ong.ro');
      const s = await sessions.createSession(identity);
      expect(await sessions.revokeByRefreshToken('nope')).toBe(false);
      expect(await sessions.revokeByRefreshToken(s.refreshToken)).toBe(true);
      expect(await code(() => sessions.rotate(s.refreshToken))).toBe(
        AuthErrorCode.AUTH_008,
      );
    });
  });

  describe('rate limits', () => {
    it('1 login email a minute per address, case-insensitive', async () => {
      await limits.assertCanIssueLogin('j@ong.ro');
      expect(await code(() => limits.assertCanIssueLogin(' J@ONG.ro '))).toBe(
        AuthErrorCode.AUTH_010,
      );
      await limits.assertCanIssueLogin('other@ong.ro');
    });

    it('keys never contain the email address', async () => {
      await limits.assertCanIssueLogin('secret-address@ong.ro');
      const redis = testApp.app.get<Redis>(REDIS_CLIENT);
      const keys = await redis.keys(`${process.env.REDIS_KEY_PREFIX}auth:*`);
      expect(keys.length).toBeGreaterThan(0);
      expect(JSON.stringify(keys)).not.toContain('secret-address');
    });
  });

  describe('mailer', () => {
    it('sends link and code in one email, naming the client app', async () => {
      await testApp.app.get(AuthMailerService).sendLogin({
        to: 'k@ong.ro',
        link: 'L'.repeat(43),
        code: '123456',
        clientName: 'VIC',
      });
      const email = testApp.mailbox.last('k@ong.ro');
      expect(email.context.code).toBe('123456');
      expect(email.context.cta.link).toBe(
        `https://app.ngohub.test/login/link?token=${'L'.repeat(43)}`,
      );
      expect(email.context.title).toContain('VIC');
    });
  });

  describe('secret box', () => {
    it('round-trips, rejects other purposes and keys, opens with an old key after rotation', () => {
      const k1 = randomBytes(32);
      const k2 = randomBytes(32);
      const sealed = sealSecret(k1, 'oidc-client-secret', 's3cret');
      expect(openSecret(k1, 'oidc-client-secret', sealed)).toBe('s3cret');
      expect(openSecret(k1, 'other', sealed)).toBeNull();
      expect(openSecret(k2, 'oidc-client-secret', sealed)).toBeNull();
      expect(openSecretWithAny([k2, k1], 'oidc-client-secret', sealed)).toBe(
        's3cret',
      );
    });
  });
});
