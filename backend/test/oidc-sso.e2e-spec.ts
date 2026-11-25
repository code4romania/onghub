// OIDC settings must be in the environment before AppModule is compiled.
process.env.OIDC_ISSUER = 'http://localhost:3001';
process.env.OIDC_INTERACTION_URL = 'https://app.ngohub.test/interaction';

import { createTestApp, TestApp } from './utils/test-app';
import { createHash, randomBytes } from 'crypto';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { OidcClientService } from 'src/modules/oidc/services/oidc-client.service';
import { UserService } from 'src/modules/user/services/user.service';
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
        scope: 'openid email profile',
        state: 'st',
        nonce: 'nn',
        code_challenge: b64url(createHash('sha256').update(verifier).digest()),
        code_challenge_method: 'S256',
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
    ]);
    ({ clientSecret } = await testApp.app.get(OidcClientService).create({
      clientId: 'vic',
      redirectUris: [REDIRECT, 'http://localhost:5173/login/ngohub/callback'],
      firstParty: true,
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
