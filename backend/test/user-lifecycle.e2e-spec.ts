// AppModule first (circular imports).
import { createTestApp, TestApp } from './utils/test-app';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { UserService } from 'src/modules/user/services/user.service';
import { OrganizationService } from 'src/modules/organization/services';
import { NotificationsService } from 'src/modules/notifications/services/notifications.service';
import ApproveOngRequestEvent from 'src/modules/notifications/events/approve-ong-request-event.class';
import { Role } from 'src/modules/user/enums/role.enum';
import { truncate } from './utils/test-data-source';

const linkFrom = (email: any): string =>
  new URL(email.context.cta.link).searchParams.get('token');

describe('user lifecycle without Cognito (O7)', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let counter = 0;
  let seq = 0;
  const ip = () => `10.2.${Math.floor(++counter / 250) % 250}.${counter % 250}`;
  const server = () => testApp.app.getHttpServer();

  const seedOrgAdmin = async (email: string) => {
    // A real organization needs its general data (logo, name...) for findWithRelations.
    const [{ id: generalId }] = await ds.query(
      `INSERT INTO organization_general (name, alias, type, email, phone, year_created, cui, contact_person)
       VALUES ($3, $3, 'association', $1, $4, 2000, $2, '{}') RETURNING id`,
      [
        email,
        `RO${++seq}`,
        `ONG Test ${seq}`,
        `+4072${String(seq).padStart(7, '0')}`,
      ],
    );
    const [{ id: orgId }] = await ds.query(
      `INSERT INTO organization (status, organization_general_id) VALUES ('active', $1) RETURNING id`,
      [generalId],
    );
    const [{ id: adminId }] = await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id) VALUES ('Admin Ong', $1, '+40700000001', 'admin', 'active', $2) RETURNING id`,
      [email, orgId],
    );
    return { orgId, adminId };
  };

  /** Logs in through the real endpoints; returns { auth, agent }. */
  const login = async (email: string) => {
    const agent = request.agent(server());
    await agent
      .post('/auth/web/login/request')
      .set('X-Forwarded-For', ip())
      .send({ email })
      .expect(200);
    const res = await agent
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: linkFrom(testApp.mailbox.last(email)) })
      .expect(200);
    return { agent, auth: { Authorization: `Bearer ${res.body.accessToken}` } };
  };

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
    // create() only checks that the organization exists, through a lookup that
    // needs the whole organization graph (legal, activity, reports...). These
    // specs are about logins, so that one check is stubbed.
    jest
      .spyOn(testApp.app.get(OrganizationService), 'findWithRelations')
      .mockImplementation(async (id: number) => ({ id }) as any);
  });

  afterAll(() => testApp?.close());

  beforeEach(async () => {
    testApp.mailbox.clear();
    testApp.cognito.calls.length = 0;
    await testApp.flushRedis();
    await truncate(ds, [
      'auth_identity',
      'oidc_payload',
      'user',
      'organization',
      'organization_general',
    ]);
  });

  it('admin invites an employee: our email with link + code, no Cognito; the link activates them', async () => {
    const { orgId } = await seedOrgAdmin('admin@ong.ro');
    const { auth } = await login('admin@ong.ro');

    const created = await request(server())
      .post('/user')
      .set(auth)
      .send({
        name: 'Ion Popescu',
        email: 'ion@ong.ro',
        phone: '+40700000002',
        organizationId: orgId,
        applicationAccess: [],
      })
      .expect(201);
    expect(created.body).toMatchObject({
      email: 'ion@ong.ro',
      status: 'pending',
      cognitoId: null,
    });
    expect(testApp.cognito.calls).toEqual([]);

    const invite = testApp.mailbox.last('ion@ong.ro');
    expect(invite.subject).toMatch(/invitat/);
    expect(invite.context.code).toMatch(/^\d{6}$/);

    await request(server())
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: linkFrom(invite) })
      .expect(200);
    const [{ status }] = await ds.query(
      `SELECT status FROM "user" WHERE email = 'ion@ong.ro'`,
    );
    expect(status).toBe('active');
  });

  it('resend invite: only while PENDING, rate limited, never via Cognito', async () => {
    const { orgId } = await seedOrgAdmin('admin2@ong.ro');
    const { auth } = await login('admin2@ong.ro');
    const { body: emp } = await request(server())
      .post('/user')
      .set(auth)
      .send({
        name: 'Maria Ionescu',
        email: 'maria@ong.ro',
        phone: '+40700000003',
        organizationId: orgId,
        applicationAccess: [],
      })
      .expect(201);

    await request(server())
      .patch(`/user/${emp.id}/resend-invite`)
      .set(auth)
      .expect(200);
    expect(testApp.mailbox.to('maria@ong.ro')).toHaveLength(2);
    await request(server())
      .patch(`/user/${emp.id}/resend-invite`)
      .set(auth)
      .expect(429);

    await testApp.flushRedis();
    await request(server())
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: linkFrom(testApp.mailbox.last('maria@ong.ro')) })
      .expect(200);
    const res = await request(server())
      .patch(`/user/${emp.id}/resend-invite`)
      .set(auth)
      .expect(400);
    expect(res.body.code).toBe('USR_016');
    expect(testApp.cognito.calls).toEqual([]);
  });

  it('restricting a user ends their NGO Hub sessions and OIDC sessions/grants', async () => {
    const { orgId } = await seedOrgAdmin('admin3@ong.ro');
    const { auth } = await login('admin3@ong.ro');
    const [{ id: empId }] = await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id) VALUES ('Emp Loyee', 'emp@ong.ro', '+40700000004', 'employee', 'active', $1) RETURNING id`,
      [orgId],
    );
    const emp = await login('emp@ong.ro');
    await ds.query(
      `INSERT INTO oidc_payload (kind, id, payload, account_id) VALUES ('Session', 's1', '{}', $1), ('Grant', 'g1', '{}', $1), ('Session', 's2', '{}', 'other')`,
      [String(empId)],
    );

    await request(server())
      .patch('/user/restrict')
      .set(auth)
      .send([empId])
      .expect(200);

    await emp.agent.post('/auth/web/refresh').expect(401);
    const rows = await ds.query(`SELECT id FROM oidc_payload ORDER BY id`);
    expect(rows.map((r) => r.id)).toEqual(['s2']);
    expect(testApp.cognito.calls).toEqual([]);
  });

  it('removing a user removes the identity (cascade) without Cognito', async () => {
    const { orgId } = await seedOrgAdmin('admin4@ong.ro');
    const { auth } = await login('admin4@ong.ro');
    const { body: emp } = await request(server())
      .post('/user')
      .set(auth)
      .send({
        name: 'Dan Pop',
        email: 'dan@ong.ro',
        phone: '+40700000005',
        organizationId: orgId,
        applicationAccess: [],
      })
      .expect(201);

    await request(server()).delete(`/user/${emp.id}`).set(auth).expect(200);
    const [{ count }] = await ds.query(
      `SELECT count(*)::int AS count FROM auth_identity WHERE user_id = $1`,
      [emp.id],
    );
    expect(count).toBe(0);
    expect(testApp.cognito.calls).toEqual([]);
  });

  it('restricting an organization ends the sessions of all its users', async () => {
    const { orgId } = await seedOrgAdmin('admin5@ong.ro');
    const admin = await login('admin5@ong.ro');

    await testApp.app.get(OrganizationService).restrict(orgId);
    await new Promise((r) => setTimeout(r, 200)); // event listener is async

    await admin.agent.post('/auth/web/refresh').expect(401);
  });

  it('organization approval: one email, with the first-login link and code', async () => {
    const [{ id: orgId }] = await ds.query(
      `INSERT INTO organization (status) VALUES ('pending') RETURNING id`,
    );
    const users = testApp.app.get(UserService);
    const user = await users.createAdmin(
      {
        name: 'Nou Admin',
        email: 'nou@ong.ro',
        phone: '+40700000006',
        organizationId: orgId,
        role: Role.ADMIN,
      },
      { invite: false },
    );
    expect(testApp.mailbox.sent).toHaveLength(0); // no separate invitation

    const first = await users.issueFirstLogin(user);
    await testApp.app
      .get(NotificationsService)
      .handleApproveOrganizationRequest(
        new ApproveOngRequestEvent('nou@ong.ro', first.loginUrl, first.code),
      );

    expect(testApp.mailbox.to('nou@ong.ro')).toHaveLength(1);
    const email = testApp.mailbox.last('nou@ong.ro');
    expect(email.context.code).toBe(first.code);
    await request(server())
      .post('/auth/login-link')
      .set('X-Forwarded-For', ip())
      .send({ token: linkFrom(email) })
      .expect(200);
  });
});
