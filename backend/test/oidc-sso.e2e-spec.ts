// OIDC settings must be in the environment before AppModule is compiled.
process.env.OIDC_ISSUER = 'http://localhost:3001';
process.env.OIDC_INTERACTION_URL = 'https://app.ngohub.test/interaction';

import { createTestApp, TestApp } from './utils/test-app';
import { createHash, randomBytes } from 'crypto';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { OidcClientService } from 'src/modules/oidc/services/oidc-client.service';
import { UserService } from 'src/modules/user/services/user.service';
import { OidcCleanupService } from 'src/modules/oidc/services/oidc-cleanup.service';
import { truncate } from './utils/test-data-source';

type Agent = ReturnType<typeof request.agent>;
const REDIRECT = 'https://vic.test/login/ngohub/callback';
const b64url = (b: Buffer) => b.toString('base64url');
const pathOf = (url: string) => {
  const u = new URL(url, 'http://localhost:3001');
  return u.pathname + u.search;
};
const linkFrom = (email: any): string =>
  new URL(email.context.cta.link).searchParams.get('token');

describe('SSO with NGO Hub: own login + OIDC provider on Postgres (O10)', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let clientSecret: string;
  let counter = 0;
  const ip = () => `10.3.${Math.floor(++counter / 250) % 250}.${counter % 250}`;

  const seedUser = async (email: string) => {
    const [{ id: orgId }] = await ds.query(
      `INSERT INTO organization (status) VALUES ('active') RETURNING id`,
    );
    const [{ id }] = await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id) VALUES ('Ana Pop', $1, '+40700000000', 'admin', 'active', $2) RETURNING id`,
      [email, orgId],
    );
    return id as number;
  };

  /** One browser: authorize, log into NGO Hub, finish the interaction. */
  const authorize = async (
    email: string,
    clientId = 'vic',
    redirectUri = REDIRECT,
    scope = 'openid email profile',
    extra: Record<string, string> = {},
  ) => {
    const agent = request.agent(testApp.app.getHttpServer());
    const verifier = b64url(randomBytes(32));
    const auth = await agent
      .get('/oidc/auth')
      .set('X-Forwarded-For', ip())
      .query({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope,
        state: 'st',
        nonce: 'nn',
        code_challenge: b64url(createHash('sha256').update(verifier).digest()),
        code_challenge_method: 'S256',
        ...extra,
      });
    return { agent, verifier, auth };
  };

  const loginAndConsent = async (agent: Agent, uid: string, email: string) => {
    await agent
      .post('/auth/web/login/request')
      .set('X-Forwarded-For', ip())
      .send({ email })
      .expect(200);
    const { body } = await agent
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: linkFrom(testApp.mailbox.last(email)) })
      .expect(200);
    const login = await agent
      .post(`/interaction/${uid}/login`)
      .set('X-Forwarded-For', ip())
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    return agent
      .get(pathOf(login.body.redirectTo))
      .set('X-Forwarded-For', ip());
  };

  const exchange = (
    agent: Agent,
    code: string,
    verifier: string,
    secret = clientSecret,
  ) =>
    agent
      .post('/oidc/token')
      .set('X-Forwarded-For', ip())
      .auth('vic', secret)
      .type('form')
      .send({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT,
        code_verifier: verifier,
      });

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
  });

  afterAll(() => testApp?.close());

  beforeEach(async () => {
    testApp.mailbox.clear();
    await testApp.flushRedis();
    await truncate(ds, [
      'auth_identity',
      'oidc_payload',
      'oidc_client',
      'user',
      'organization',
      'organization_general',
      'auth_event',
    ]);
    ({ clientSecret } = await testApp.app.get(OidcClientService).create({
      clientId: 'vic',
      redirectUris: [REDIRECT, 'http://localhost:5173/login/ngohub/callback'],
      firstParty: true,
      scopes: ['openid', 'email', 'profile', 'organization'],
    }));
  });

  it('full flow: code + PKCE + secret, state in Postgres, userinfo with verified email', async () => {
    const userId = await seedUser('ana@ong.ro');
    const { agent, verifier, auth } = await authorize('ana@ong.ro');
    expect(auth.status).toBe(303);
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    expect(auth.headers.location).toBe(
      `https://app.ngohub.test/interaction/${uid}`,
    );

    const resumed = await loginAndConsent(agent, uid, 'ana@ong.ro');
    expect(resumed.status).toBe(303);
    const cb = new URL(resumed.headers.location);
    expect(cb.origin + cb.pathname).toBe(REDIRECT);
    const code = cb.searchParams.get('code');

    const token = await exchange(agent, code, verifier).expect(200);
    expect(token.body.refresh_token).toBeUndefined();

    const me = await request(testApp.app.getHttpServer())
      .get('/oidc/me')
      .set('Authorization', `Bearer ${token.body.access_token}`)
      .expect(200);
    expect(me.body).toEqual({
      sub: String(userId),
      email: 'ana@ong.ro',
      email_verified: true,
      name: 'Ana Pop',
    });

    const kinds = await ds.query(
      `SELECT DISTINCT kind FROM oidc_payload WHERE account_id = $1 ORDER BY kind`,
      [String(userId)],
    );
    expect(kinds.map((k) => k.kind)).toEqual(
      expect.arrayContaining(['AccessToken', 'Grant', 'Session']),
    );

    // Replay: refused, and the first exchange's token is revoked with the grant.
    const replay = await exchange(agent, code, verifier).expect(400);
    expect(replay.body.error).toBe('invalid_grant');
    await request(testApp.app.getHttpServer())
      .get('/oidc/me')
      .set('Authorization', `Bearer ${token.body.access_token}`)
      .expect(401);
  });

  it('prompt=login: a session from before the request is refused, a fresh login finishes it', async () => {
    await seedUser('ana@ong.ro');
    const login = async (agent: ReturnType<typeof request.agent>) => {
      await agent
        .post('/auth/web/login/request')
        .set('X-Forwarded-For', ip())
        .send({ email: 'ana@ong.ro' })
        .expect(200);
      const { body } = await agent
        .post('/auth/login-link')
        .set('X-Forwarded-For', ip())
        .send({ token: linkFrom(testApp.mailbox.last('ana@ong.ro')) })
        .expect(200);
      return body.accessToken as string;
    };
    const earlier = await login(request.agent(testApp.app.getHttpServer()));
    // JWT iat is in seconds: the request must start in a later second.
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const { agent, auth } = await authorize(
      'ana@ong.ro',
      'vic',
      REDIRECT,
      'openid email profile',
      { prompt: 'login' },
    );
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    const details = await agent.get(`/interaction/${uid}`).expect(200);
    expect(details.body.freshLogin).toBe(true);

    const stale = await agent
      .post(`/interaction/${uid}/login`)
      .set('X-Forwarded-For', ip())
      .set('Authorization', `Bearer ${earlier}`)
      .expect(403);
    expect(stale.body.code).toBe('FRESH_LOGIN_REQUIRED');

    testApp.mailbox.clear();
    await testApp.flushRedis();
    const fresh = await login(agent);
    const done = await agent
      .post(`/interaction/${uid}/login`)
      .set('X-Forwarded-For', ip())
      .set('Authorization', `Bearer ${fresh}`)
      .expect(200);
    expect(done.body.redirectTo).toContain(`/oidc/auth/${uid}`);

    // Without prompt=login the same earlier session is enough.
    const plain = await authorize('ana@ong.ro');
    const plainUid = new URL(plain.auth.headers.location).pathname
      .split('/')
      .pop();
    expect(
      (await plain.agent.get(`/interaction/${plainUid}`)).body.freshLogin,
    ).toBe(false);
  });

  it('restricting the user cuts off /oidc/me at once and removes OIDC state', async () => {
    const userId = await seedUser('rita@ong.ro');
    const { agent, verifier, auth } = await authorize('rita@ong.ro');
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    const resumed = await loginAndConsent(agent, uid, 'rita@ong.ro');
    const code = new URL(resumed.headers.location).searchParams.get('code');
    const token = await exchange(agent, code, verifier).expect(200);

    await testApp.app.get(UserService).restrictAccess([userId]);

    await request(testApp.app.getHttpServer())
      .get('/oidc/me')
      .set('Authorization', `Bearer ${token.body.access_token}`)
      .expect(401);
    const [{ count }] = await ds.query(
      `SELECT count(*)::int AS count FROM oidc_payload WHERE account_id = $1`,
      [String(userId)],
    );
    expect(count).toBe(0);
  });

  it('organization scope: the claim at /oidc/me, read live; absent without the scope', async () => {
    const userId = await seedUser('org@ong.ro');
    const [{ id: generalId }] = await ds.query(
      `INSERT INTO organization_general (name, alias, type, email, phone, year_created, cui, contact_person, address, city_id, county_id, short_description, website)
       VALUES ('Asociația Test', 'AT', 'association', 'contact@at.ro', '+40711111111', 2001, '12345678', '{}', 'Str. Lungă 1', 1, 53, 'Pe scurt', 'https://at.ro') RETURNING id`,
    );
    await ds.query(
      `UPDATE organization SET organization_general_id = $1 WHERE id = (SELECT organization_id FROM "user" WHERE id = $2)`,
      [generalId, userId],
    );
    const [{ organization_id: orgId }] = await ds.query(
      `SELECT organization_id FROM "user" WHERE id = $1`,
      [userId],
    );

    const userinfo = async (scope: string) => {
      testApp.mailbox.clear();
      await testApp.flushRedis();
      const { agent, verifier, auth } = await authorize(
        'org@ong.ro',
        'vic',
        REDIRECT,
        scope,
      );
      const uid = new URL(auth.headers.location).pathname.split('/').pop();
      const resumed = await loginAndConsent(agent, uid, 'org@ong.ro');
      const code = new URL(resumed.headers.location).searchParams.get('code');
      const token = await exchange(agent, code, verifier).expect(200);
      return (accessToken = token.body.access_token) =>
        request(testApp.app.getHttpServer())
          .get('/oidc/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .then((r) => r.body);
    };

    const me = await userinfo('openid email profile organization');
    expect((await me()).organization).toEqual({
      id: orgId,
      cui: '12345678',
      name: 'Asociația Test',
      role: 'admin',
      email: 'contact@at.ro',
      phone: '+40711111111',
      address: 'Str. Lungă 1',
      county: { id: 53, name: 'Vaslui' },
      city: { id: 1, name: '1 Decembrie' },
      short_description: 'Pe scurt',
      website: 'https://at.ro',
      logo_url: null,
      logo_url_expires_at: null,
    });

    // Live: a change in NGO Hub shows on the next call.
    await ds.query(
      `UPDATE organization_general SET website = 'https://nou.at.ro' WHERE id = $1`,
      [generalId],
    );
    expect((await me()).organization.website).toBe('https://nou.at.ro');

    const without = await userinfo('openid email');
    expect(await without()).toEqual({
      sub: String(userId),
      email: 'org@ong.ro',
      email_verified: true,
    });
  });

  it('silent SSO for the same browser until NGO Hub logout closes the OIDC session (O13)', async () => {
    await seedUser('sso@ong.ro');
    const { agent, auth } = await authorize('sso@ong.ro');
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    await loginAndConsent(agent, uid, 'sso@ong.ro');

    const again = () =>
      agent
        .get('/oidc/auth')
        .set('X-Forwarded-For', ip())
        .query({
          client_id: 'vic',
          redirect_uri: REDIRECT,
          response_type: 'code',
          scope: 'openid',
          state: 's2',
          code_challenge: b64url(
            createHash('sha256').update('v'.repeat(43)).digest(),
          ),
          code_challenge_method: 'S256',
        });
    expect(
      new URL((await again()).headers.location).searchParams.get('code'),
    ).toBeTruthy();

    // JSON only (a cross-site form cannot end the session).
    await agent
      .post('/interaction/session/end')
      .set('X-Forwarded-For', ip())
      .type('form')
      .send('a=b')
      .expect(400);
    await agent
      .post('/interaction/session/end')
      .set('X-Forwarded-For', ip())
      .send({})
      .expect(204);

    expect((await again()).headers.location).toMatch(
      /^https:\/\/app\.ngohub\.test\/interaction\//,
    );
  });

  it('client-initiated logout: our confirm page with a session; CSP-allowed auto-submit without', async () => {
    await seedUser('out@ong.ro');
    const { agent, auth } = await authorize('out@ong.ro');
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    await loginAndConsent(agent, uid, 'out@ong.ro');

    const withSession = await agent
      .get('/oidc/session/end')
      .set('X-Forwarded-For', ip())
      .query({ client_id: 'vic' })
      .expect(200);
    expect(withSession.text).toContain('Vrei să te deconectezi din NGO Hub?');
    expect(withSession.text).not.toMatch(/<script/i);

    // No session: the library confirms by itself with an inline script whose
    // hash it adds to helmet's CSP header, so the browser runs it.
    const noSession = await request(testApp.app.getHttpServer())
      .get('/oidc/session/end')
      .set('X-Forwarded-For', ip())
      .query({ client_id: 'vic' })
      .expect(200);
    expect(noSession.headers['content-security-policy']).toMatch(/'sha256-/);
  });

  it('cleanup removes expired OIDC rows and old ended tokens, keeps live ones', async () => {
    await ds.query(
      `INSERT INTO oidc_payload (kind, id, payload, expires_at) VALUES
       ('Interaction', 'old', '{}', now() - interval '1 minute'),
       ('Interaction', 'live', '{}', now() + interval '5 minutes')`,
    );
    const result = await testApp.app.get(OidcCleanupService).run();
    expect(result.oidc).toBe(1);
    const rows = await ds.query(`SELECT id FROM oidc_payload`);
    expect(rows.map((r) => r.id)).toEqual(['live']);
  });

  it('CORS: the app origin with credentials, no other origin', async () => {
    const server = testApp.app.getHttpServer();
    const ok = await request(server)
      .options('/interaction/x/login')
      .set('Origin', 'https://app.ngohub.test')
      .set('Access-Control-Request-Method', 'POST');
    expect(ok.headers['access-control-allow-origin']).toBe(
      'https://app.ngohub.test',
    );
    expect(ok.headers['access-control-allow-credentials']).toBe('true');

    const evil = await request(server)
      .options('/interaction/x/login')
      .set('Origin', 'https://evil.test')
      .set('Access-Control-Request-Method', 'POST');
    expect(evil.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('auth_event journals logins, failures and provider events, without emails or secrets (O14)', async () => {
    const userId = await seedUser('log@ong.ro');
    const { agent, verifier, auth } = await authorize('log@ong.ro');
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    const resumed = await loginAndConsent(agent, uid, 'log@ong.ro');
    const code = new URL(resumed.headers.location).searchParams.get('code');
    await exchange(agent, code, verifier).expect(200);
    await exchange(agent, code, verifier).expect(400); // replay
    await request(testApp.app.getHttpServer())
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: 'x'.repeat(43) })
      .expect(400);
    await new Promise((r) => setTimeout(r, 100)); // provider events are fire-and-forget

    const rows = await ds.query(
      `SELECT type, user_id, client_id, reason FROM auth_event ORDER BY id`,
    );
    const types = rows.map((r) => r.type);
    expect(types).toEqual(
      expect.arrayContaining([
        'login.requested',
        'login.succeeded',
        'oidc.interaction.ended',
        'oidc.grant.succeeded',
        'oidc.grant.failed',
        'login.failed',
      ]),
    );
    expect(rows.find((r) => r.type === 'login.succeeded')).toMatchObject({
      user_id: userId,
      reason: 'link:login',
    });
    expect(rows.find((r) => r.type === 'oidc.grant.succeeded')).toMatchObject({
      user_id: userId,
      client_id: 'vic',
    });
    expect(rows.find((r) => r.type === 'oidc.grant.failed')).toMatchObject({
      client_id: 'vic',
      reason: 'invalid_grant',
    });
    expect(rows.find((r) => r.type === 'login.failed')).toMatchObject({
      user_id: null,
      reason: 'link:AUTH_005',
    });

    const dump = JSON.stringify(await ds.query(`SELECT * FROM auth_event`));
    expect(dump).not.toContain('@');
    expect(dump).not.toContain(code);
    expect(dump).not.toContain(clientSecret);
  });

  it('wrong client secret is refused', async () => {
    await seedUser('bob@ong.ro');
    const { agent, verifier, auth } = await authorize('bob@ong.ro');
    const uid = new URL(auth.headers.location).pathname.split('/').pop();
    const resumed = await loginAndConsent(agent, uid, 'bob@ong.ro');
    const code = new URL(resumed.headers.location).searchParams.get('code');
    const res = await exchange(agent, code, verifier, 'wrong-secret').expect(
      401,
    );
    expect(res.body.error).toBe('invalid_client');
  });

  it('localhost redirect URIs are ignored unless OIDC_ALLOW_LOCALHOST_REDIRECTS=true', async () => {
    const { auth } = await authorize(
      'x@ong.ro',
      'vic',
      'http://localhost:5173/login/ngohub/callback',
    );
    expect(auth.status).toBe(400);
    expect(auth.body).toEqual({ error: 'invalid_redirect_uri' });
  });

  it('unknown or disabled clients are refused', async () => {
    expect((await authorize('x@ong.ro', 'nope')).auth.body).toEqual({
      error: 'invalid_client',
    });
    await ds.query(`UPDATE oidc_client SET status = 'disabled'`);
    expect((await authorize('x@ong.ro')).auth.body).toEqual({
      error: 'invalid_client',
    });
  });

  it('the client secret is stored sealed, never in clear', async () => {
    const [{ client_secret_enc }] = await ds.query(
      `SELECT client_secret_enc FROM oidc_client`,
    );
    expect(client_secret_enc).toMatch(/^v1\./);
    expect(client_secret_enc).not.toContain(clientSecret);
  });

  it('rate limits the provider per IP', async () => {
    const server = testApp.app.getHttpServer();
    const statuses = [];
    for (let i = 0; i < 125; i++) {
      statuses.push(
        (
          await request(server)
            .get('/.well-known/openid-configuration')
            .set('X-Forwarded-For', '10.9.9.9')
        ).status,
      );
    }
    expect(statuses.slice(0, 120).every((s) => s === 200)).toBe(true);
    expect(statuses.slice(120)).toEqual([429, 429, 429, 429, 429]);
  });
});
