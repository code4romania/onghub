import { createTestApp, TestApp } from './utils/test-app';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { QUEUES } from 'src/common/constants/queues.constants';
import { AuthMigrationService } from 'src/modules/authentication/services/auth-migration.service';
import { truncate } from './utils/test-data-source';

const waitFor = async (check: () => boolean | Promise<boolean>, ms = 5000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await check()) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('timed out');
};

describe('auth:migrate (O9)', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let migration: AuthMigrationService;
  let queue: Queue;

  const seed = async () => {
    const [{ id: orgId }] = await ds.query(
      `INSERT INTO organization (status) VALUES ('active') RETURNING id`,
    );
    await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id, cognito_id) VALUES
       ('Activ User', 'activ@ong.ro', '+40700000010', 'admin', 'active', $1, 'cog-activ'),
       ('Pending User', 'pending@ong.ro', '+40700000011', 'employee', 'pending', $1, 'cog-pending'),
       ('Super Admin', 'super@ngohub.ro', '+40700000012', 'super-admin', 'active', NULL, 'cog-super')`,
      [orgId],
    );
  };

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
    migration = testApp.app.get(AuthMigrationService);
    queue = testApp.app.get<Queue>(getQueueToken(QUEUES.AUTH_TRANSITION));
  });

  afterAll(async () => {
    await migration?.drop();
    await testApp?.close();
  });

  beforeEach(async () => {
    testApp.mailbox.clear();
    await migration.drop();
    await testApp.flushRedis();
    await truncate(ds, ['auth_identity', 'user', 'organization']);
    await seed();
  });

  it('--dry-run writes nothing', async () => {
    const report = await migration.migrate({ dryRun: true });
    expect(report).toEqual({
      dryRun: true,
      users: 3,
      created: 3,
      existing: 0,
      queued: 0,
      restricted: 0,
    });
    const [{ count }] = await ds.query(
      `SELECT count(*)::int AS count FROM auth_identity`,
    );
    expect(count).toBe(0);
    expect(await migration.pending()).toBe(0);
  });

  it('creates identities (legacy username kept, email not verified), holds the emails; a second run changes nothing', async () => {
    const first = await migration.migrate({ dryRun: false });
    expect(first).toEqual({
      dryRun: false,
      users: 3,
      created: 3,
      existing: 0,
      queued: 3,
      restricted: 0,
    });

    const rows = await ds.query(
      `SELECT u.email, i.legacy_cognito_username, i.email_verified_at, u.status
       FROM auth_identity i JOIN "user" u ON u.id = i.user_id ORDER BY u.email`,
    );
    expect(rows).toEqual([
      {
        email: 'activ@ong.ro',
        legacy_cognito_username: 'cog-activ',
        email_verified_at: null,
        status: 'active',
      },
      {
        email: 'pending@ong.ro',
        legacy_cognito_username: 'cog-pending',
        email_verified_at: null,
        status: 'pending',
      },
      {
        email: 'super@ngohub.ro',
        legacy_cognito_username: 'cog-super',
        email_verified_at: null,
        status: 'active',
      },
    ]);

    await new Promise((r) => setTimeout(r, 300));
    expect(testApp.mailbox.sent).toHaveLength(0); // held
    expect(await queue.isPaused()).toBe(true);

    const second = await migration.migrate({ dryRun: false });
    expect(second).toEqual({
      dryRun: false,
      users: 3,
      created: 0,
      existing: 3,
      queued: 0,
      restricted: 0,
    });
    expect(await migration.pending()).toBe(3);
  });

  it('release sends one transition email per user, whose link logs in (and activates PENDING)', async () => {
    await migration.migrate({ dryRun: false });
    expect(await migration.release()).toEqual({ waiting: 3 });
    await waitFor(() => testApp.mailbox.sent.length === 3);

    const email = testApp.mailbox.last('pending@ong.ro');
    expect(email.subject).toMatch(/fără parolă/);
    const token = new URL(email.context.cta.link).searchParams.get('token');
    await request(testApp.app.getHttpServer())
      .post('/auth/login-link')
      .send({ token })
      .expect(200);
    const [{ status }] = await ds.query(
      `SELECT status FROM "user" WHERE email = 'pending@ong.ro'`,
    );
    expect(status).toBe('active');
  });

  it('restricted users, and users of restricted NGOs, get an identity but no transition email', async () => {
    const [{ id: restrictedOrg }] = await ds.query(
      `INSERT INTO organization (status) VALUES ('restricted') RETURNING id`,
    );
    const [{ id: activeOrg }] = await ds.query(
      `SELECT organization_id AS id FROM "user" WHERE email = 'activ@ong.ro'`,
    );
    await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status, organization_id, cognito_id) VALUES
       ('Restrictionat', 'restrictionat@ong.ro', '+40700000013', 'employee', 'restricted', $1, 'cog-r1'),
       ('Din ONG restrictionat', 'ong-restrictionat@ong.ro', '+40700000014', 'admin', 'active', $2, 'cog-r2')`,
      [activeOrg, restrictedOrg],
    );

    expect(await migration.migrate({ dryRun: true })).toEqual({
      dryRun: true,
      users: 5,
      created: 5,
      existing: 0,
      queued: 0,
      restricted: 2,
    });
    expect(await migration.migrate({ dryRun: false })).toEqual({
      dryRun: false,
      users: 5,
      created: 5,
      existing: 0,
      queued: 3,
      restricted: 2,
    });
    const [{ count }] = await ds.query(
      `SELECT count(*)::int AS count FROM auth_identity`,
    );
    expect(count).toBe(5); // restored later, they log in by email as usual

    // Restricted after the migration, before the release: not emailed either.
    await ds.query(
      `UPDATE "user" SET status = 'restricted' WHERE email = 'pending@ong.ro'`,
    );
    await migration.release();
    await waitFor(() => testApp.mailbox.sent.length === 2);
    await new Promise((r) => setTimeout(r, 300));
    const recipients = testApp.mailbox.sent.map((m) => m.to).sort();
    expect(recipients).toEqual(['activ@ong.ro', 'super@ngohub.ro']);
  });

  it('drop forgets the held emails (rollback)', async () => {
    await migration.migrate({ dryRun: false });
    await migration.drop();
    expect(await migration.pending()).toBe(0);
    await migration.release();
    await new Promise((r) => setTimeout(r, 300));
    expect(testApp.mailbox.sent).toHaveLength(0);
  });
});
