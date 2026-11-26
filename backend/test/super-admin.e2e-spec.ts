import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { SuperAdminService } from 'src/modules/authentication/services/super-admin.service';
import { createTestApp, TestApp } from './utils/test-app';
import { truncate } from './utils/test-data-source';

const linkFrom = (email: any): string =>
  new URL(email.context.cta.link).searchParams.get('token');
const HOUR = 60 * 60 * 1000;

describe('super admins (plan 5.5): the command, journal and shorter sessions', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let superAdmins: SuperAdminService;

  const loginWithInvite = async (email: string) => {
    const agent = request.agent(testApp.app.getHttpServer());
    const res = await agent
      .post('/auth/login-link')
      .send({ token: linkFrom(testApp.mailbox.last(email)) })
      .expect(200);
    return { agent, accessToken: res.body.accessToken as string };
  };

  const sessionExpiry = async (email: string): Promise<number> => {
    const [row] = await ds.query(
      `SELECT r.expires_at FROM refresh_token r
         JOIN auth_identity i ON i.id = r.identity_id
         JOIN "user" u ON u.id = i.user_id
        WHERE u.email = $1 AND r.revoked_at IS NULL
        ORDER BY r.created_on DESC LIMIT 1`,
      [email],
    );
    return new Date(row.expires_at).getTime();
  };

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
    superAdmins = testApp.app.get(SuperAdminService);
  });

  afterAll(() => testApp?.close());

  beforeEach(async () => {
    testApp.mailbox.clear();
    await testApp.flushRedis();
    await truncate(ds, ['auth_identity', 'auth_event', 'user', 'organization']);
  });

  it('adds a super admin: no organization, PENDING, invited, journaled; the session lasts 12 hours and refresh does not extend it', async () => {
    const added = await superAdmins.add({
      email: 'Sef@Code4.ro',
      name: 'Șef Platformă',
      phone: '+40700000099',
    });
    expect(added).toMatchObject({ email: 'sef@code4.ro', status: 'pending' });

    const [user] = await ds.query(
      `SELECT role, status, organization_id FROM "user" WHERE email = 'sef@code4.ro'`,
    );
    expect(user).toEqual({
      role: 'super-admin',
      status: 'pending',
      organization_id: null,
    });
    const events = await ds.query(
      `SELECT type FROM auth_event WHERE user_id = $1 ORDER BY id`,
      [added.id],
    );
    expect(events.map((e) => e.type)).toEqual([
      'super_admin.added',
      'invite.sent',
    ]);

    const { agent } = await loginWithInvite('sef@code4.ro');
    const first = await sessionExpiry('sef@code4.ro');
    expect(first - Date.now()).toBeGreaterThan(11.9 * HOUR);
    expect(first - Date.now()).toBeLessThanOrEqual(12 * HOUR);

    await agent.post('/auth/web/refresh').expect(200);
    expect(await sessionExpiry('sef@code4.ro')).toBe(first);
  });

  it('other users keep the 7-day session that refresh extends', async () => {
    const [{ id: orgId }] = await ds.query(
      `INSERT INTO organization (status) VALUES ('active') RETURNING id`,
    );
    await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id)
       VALUES ('Ana', 'ana@ong.ro', '+40700000098', 'admin', 'active', $1)`,
      [orgId],
    );
    await request(testApp.app.getHttpServer())
      .post('/auth/web/login/request')
      .send({ email: 'ana@ong.ro' })
      .expect(200);
    await loginWithInvite('ana@ong.ro');
    expect((await sessionExpiry('ana@ong.ro')) - Date.now()).toBeGreaterThan(
      6.9 * 24 * HOUR,
    );
  });

  it('refuses an email that already has a user', async () => {
    await superAdmins.add({ email: 'sef@code4.ro', name: 'Șef' });
    await expect(
      superAdmins.add({ email: 'SEF@code4.ro', name: 'Altul' }),
    ).rejects.toThrow(/already/);
  });

  it('removing restricts the super admin and ends their sessions at once, journaled; the list shows it', async () => {
    const added = await superAdmins.add({ email: 'sef@code4.ro', name: 'Șef' });
    const { agent } = await loginWithInvite('sef@code4.ro');

    await superAdmins.remove('sef@code4.ro');

    await agent.post('/auth/web/refresh').expect(401);
    const [{ status }] = await ds.query(
      `SELECT status FROM "user" WHERE id = $1`,
      [added.id],
    );
    expect(status).toBe('restricted');
    const [{ count }] = await ds.query(
      `SELECT count(*)::int AS count FROM auth_event WHERE user_id = $1 AND type = 'super_admin.removed'`,
      [added.id],
    );
    expect(count).toBe(1);
    expect(await superAdmins.list()).toEqual([
      expect.objectContaining({ email: 'sef@code4.ro', status: 'restricted' }),
    ]);
    await expect(superAdmins.remove('nobody@code4.ro')).rejects.toThrow(
      /no super admin/,
    );
  });
});
