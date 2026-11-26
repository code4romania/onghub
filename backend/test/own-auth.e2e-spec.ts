import { generateKeyPairSync } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { JWT_AUDIENCE, JWT_ISSUER } from 'src/common/config/auth.config';
import { createTestApp, TestApp } from './utils/test-app';
import { truncate } from './utils/test-data-source';

/** Cookie jar per "browser": supertest agents keep cookies by path. */
type Browser = ReturnType<typeof request.agent>;

const linkFrom = (email: any): string =>
  new URL(email.context.cta.link).searchParams.get('token');
const codeFrom = (email: any): string => email.context.code;

describe('own auth endpoints (O6)', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let counter = 0;

  /** Each request from its own address so the IP throttles stay out of the way. */
  const browser = (): Browser => request.agent(testApp.app.getHttpServer());
  const ip = () => `10.1.${Math.floor(++counter / 250) % 250}.${counter % 250}`;

  const seed = async (
    email: string,
    opts: { status?: string; orgStatus?: string; role?: string } = {},
  ): Promise<{ userId: number; orgId: number }> => {
    const [{ id: orgId }] = await ds.query(
      `INSERT INTO organization (status) VALUES ($1) RETURNING id`,
      [opts.orgStatus ?? 'active'],
    );
    const [{ id: userId }] = await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id) VALUES ('Ana Pop', $1, '+40700000000', $2, $3, $4) RETURNING id`,
      [email, opts.role ?? 'admin', opts.status ?? 'active', orgId],
    );
    return { userId, orgId };
  };

  const requestLogin = (b: Browser, email: string) =>
    b
      .post('/auth/web/login/request')
      .set('X-Forwarded-For', ip())
      .send({ email });

  /** Full link login; returns the browser (holding the refresh cookie) and the access token. */
  const loginByLink = async (email: string) => {
    const b = browser();
    await requestLogin(b, email).expect(200);
    const res = await b
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: linkFrom(testApp.mailbox.last(email)) })
      .expect(200);
    return { b, accessToken: res.body.accessToken as string, res };
  };

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
  });

  afterAll(() => testApp?.close());

  beforeEach(async () => {
    testApp.mailbox.clear();
    await testApp.flushRedis();
    await truncate(ds, ['auth_identity', 'user', 'organization']);
  });

  it('request answers the same for known and unknown emails; only the known one gets mail', async () => {
    await seed('ana@ong.ro');
    const known = await requestLogin(browser(), 'Ana@Ong.ro ').expect(200);
    const unknown = await requestLogin(browser(), 'nobody@ong.ro').expect(200);

    expect(known.body).toEqual({ maskedEmail: 'a•••@ong.ro' });
    expect(unknown.body).toEqual({ maskedEmail: 'n•••y@ong.ro' });
    expect(testApp.mailbox.sent).toHaveLength(1);
    const email = testApp.mailbox.last('ana@ong.ro');
    expect(codeFrom(email)).toMatch(/^\d{6}$/);
    expect(linkFrom(email)).toMatch(/^[A-Za-z0-9_-]{43}$/);
    // Readable without HTML or images too: a plain-text part with the code and the link.
    expect(email.text).toContain(codeFrom(email));
    expect(email.text).toContain(email.context.cta.link);
    expect(email.text).not.toMatch(/<[a-z]/i);
    expect(String(known.headers['set-cookie'])).toMatch(
      /ngohub_login_nonce=.*HttpOnly/,
    );
  });

  it('login with the link: session, refresh cookie, PENDING → ACTIVE, email verified; link works once', async () => {
    const { userId } = await seed('bob@ong.ro', { status: 'pending' });
    const b = browser();
    await requestLogin(b, 'bob@ong.ro').expect(200);
    const link = linkFrom(testApp.mailbox.last('bob@ong.ro'));

    // GET only peeks.
    const info = await b.get(`/auth/token/${link}`).expect(200);
    expect(info.body).toEqual({ type: 'login', maskedEmail: 'b•••@ong.ro' });

    const res = await b
      .post('/auth/login-link')
      .send({ token: link })
      .expect(200);
    expect(res.body).toEqual({
      accessToken: expect.any(String),
      expiresIn: 900,
    });
    expect(String(res.headers['set-cookie'])).toMatch(
      /ngohub_refresh=.*Path=\/auth\/web.*HttpOnly/,
    );

    const profile = await request(testApp.app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
      .expect(200);
    expect(profile.body).toMatchObject({
      id: userId,
      email: 'bob@ong.ro',
      status: 'active',
    });

    const [{ email_verified_at }] = await ds.query(
      `SELECT email_verified_at FROM auth_identity WHERE user_id = $1`,
      [userId],
    );
    expect(email_verified_at).toBeTruthy();

    const again = await b
      .post('/auth/login-link')
      .send({ token: link })
      .expect(400);
    expect(again.body.code).toBe('AUTH_005');
  });

  it('login with the code only works from the browser that asked for it', async () => {
    await seed('cris@ong.ro');
    const asker = browser();
    await requestLogin(asker, 'cris@ong.ro').expect(200);
    const code = codeFrom(testApp.mailbox.last('cris@ong.ro'));

    // Same code from another browser (no or different nonce cookie): refused.
    await browser()
      .post('/auth/login-code')
      .send({ email: 'cris@ong.ro', code })
      .expect(400);
    const other = browser();
    await requestLogin(other, 'someone-else@ong.ro').expect(200); // gets its own nonce
    await other
      .post('/auth/login-code')
      .send({ email: 'cris@ong.ro', code })
      .expect(400);

    const ok = await asker
      .post('/auth/login-code')
      .send({ email: 'cris@ong.ro', code })
      .expect(200);
    expect(ok.body.accessToken).toEqual(expect.any(String));
  });

  it('refresh rotates through the cookie; logout ends the session', async () => {
    await seed('dan@ong.ro');
    const { b } = await loginByLink('dan@ong.ro');

    const r1 = await b.post('/auth/web/refresh').expect(200);
    expect(r1.body.accessToken).toEqual(expect.any(String));
    expect(String(r1.headers['set-cookie'])).toMatch(/ngohub_refresh=/);

    await b.post('/auth/web/logout').expect(204);
    const after = await b.post('/auth/web/refresh').expect(401);
    expect(after.body.code).toBe('AUTH_008');
  });

  it('restricted user: no email on request, 403 on the API with an existing token', async () => {
    const { userId } = await seed('eva@ong.ro');
    const { accessToken } = await loginByLink('eva@ong.ro');
    testApp.mailbox.clear();
    await testApp.flushRedis();

    await ds.query(`UPDATE "user" SET status = 'restricted' WHERE id = $1`, [
      userId,
    ]);
    await requestLogin(browser(), 'eva@ong.ro').expect(200);
    expect(testApp.mailbox.sent).toHaveLength(0);

    await request(testApp.app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('restricted organization: link login refused with AUTH_004', async () => {
    const { orgId } = await seed('fane@ong.ro');
    const b = browser();
    await requestLogin(b, 'fane@ong.ro').expect(200);
    await ds.query(
      `UPDATE organization SET status = 'restricted' WHERE id = $1`,
      [orgId],
    );
    const res = await b
      .post('/auth/login-link')
      .send({ token: linkFrom(testApp.mailbox.last('fane@ong.ro')) })
      .expect(403);
    expect(res.body.code).toBe('AUTH_004');
  });

  it('rejects tokens not issued for the NGO Hub API (wrong key, audience or issuer)', async () => {
    const { userId } = await seed('gina@ong.ro');
    await loginByLink('gina@ong.ro');
    const [{ id: sub }] = await ds.query(
      `SELECT id FROM auth_identity WHERE user_id = $1`,
      [userId],
    );
    const jwt = testApp.app.get(JwtService);
    const server = testApp.app.getHttpServer();
    const call = (token: string) =>
      request(server).get('/profile').set('Authorization', `Bearer ${token}`);

    await call(jwt.sign({ sub, sid: 'x' })).expect(200); // control

    // e.g. an ID token the OIDC provider issued to VIC: other audience
    await call(jwt.sign({ sub, sid: 'x' }, { audience: 'vic-test' })).expect(
      401,
    );
    await call(
      jwt.sign({ sub, sid: 'x' }, { issuer: 'http://localhost:3001' }),
    ).expect(401);

    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const forged = new JwtService({}).sign(
      { sub, sid: 'x' },
      {
        privateKey: privateKey.export({
          type: 'pkcs8',
          format: 'pem',
        }) as string,
        algorithm: 'RS256',
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );
    await call(forged).expect(401);
    await call(jwt.sign({ sub: 'not-a-uuid', sid: 'x' })).expect(401);
  });

  it('a second request within a minute answers the same but sends nothing', async () => {
    await seed('ion@ong.ro');
    await requestLogin(browser(), 'ion@ong.ro').expect(200);
    await requestLogin(browser(), 'ion@ong.ro').expect(200);
    expect(testApp.mailbox.to('ion@ong.ro')).toHaveLength(1);
  });

  it('resend from a used link sends a fresh login; unknown secrets are silent', async () => {
    await seed('jon@ong.ro');
    const b = browser();
    await requestLogin(b, 'jon@ong.ro').expect(200);
    const link = linkFrom(testApp.mailbox.last('jon@ong.ro'));
    await b.post('/auth/login-link').send({ token: link }).expect(200);
    await testApp.flushRedis();

    await b.post(`/auth/token/${link}/resend`).expect(204);
    expect(testApp.mailbox.to('jon@ong.ro')).toHaveLength(2);
    await b.post(`/auth/token/${'x'.repeat(43)}/resend`).expect(204);
    expect(testApp.mailbox.sent).toHaveLength(2);
  });
});
