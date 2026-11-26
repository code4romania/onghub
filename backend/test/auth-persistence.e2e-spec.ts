import { DataSource, QueryFailedError } from 'typeorm';
import { AuthIdentityFacade } from 'src/modules/authentication/services/auth-identity.facade';
import {
  AuthTokenForm,
  AuthTokenType,
} from 'src/modules/authentication/enums/auth.enums';
import { createTestApp, TestApp } from './utils/test-app';
import { openMigrationDataSource, truncate } from './utils/test-data-source';

const AUTH_TABLES = [
  'auth_identity',
  'auth_token',
  'refresh_token',
  'auth_identity_provider',
  'oidc_client',
  'oidc_payload',
  'auth_event',
];

describe('auth persistence (O4)', () => {
  let testApp: TestApp;
  let ds: DataSource;
  let facade: AuthIdentityFacade;

  const createUser = async (email: string): Promise<number> => {
    const [{ id }] = await ds.query(
      `INSERT INTO "user" (name, email, phone, role, status) VALUES ($1, $2, '+40700000000', 'employee', 'active') RETURNING id`,
      ['Test User', email],
    );
    return id;
  };

  const inAnHour = () => new Date(Date.now() + 3600_000);

  beforeAll(async () => {
    testApp = await createTestApp();
    ds = testApp.dataSource;
    facade = testApp.app.get(AuthIdentityFacade);
  });

  afterAll(() => testApp?.close());

  beforeEach(() => truncate(ds, [...AUTH_TABLES, 'user']));

  it('entities match the migration for every auth table (no schema drift)', async () => {
    const sql = await ds.driver.createSchemaBuilder().log();
    const drift = sql.upQueries
      .map((q) => q.query)
      .filter((q) =>
        [
          ...AUTH_TABLES,
          'auth_token_type_enum',
          'auth_token_form_enum',
          'oidc_client_status_enum',
        ].some(
          (name) => q.includes(`"${name}"`) || q.includes(`"public"."${name}"`),
        ),
      );
    expect(drift).toEqual([]);
  });

  it('migrations are reversible', async () => {
    const migrations = await openMigrationDataSource();
    const runner = migrations.createQueryRunner();
    try {
      // Undo DropCognitoLegacy (O16): the columns and the table come back, empty.
      await migrations.undoLastMigration();
      expect(await runner.hasColumn('user', 'cognito_id')).toBe(true);
      expect(await runner.hasColumn('application', 'cognito_client_id')).toBe(
        true,
      );
      expect(await runner.hasTable('public_keys')).toBe(true);
      // Then UserEmailLowerUnique and OwnAuthTables, and redo all three.
      await migrations.undoLastMigration();
      await migrations.undoLastMigration();
      expect(await runner.hasTable('auth_identity')).toBe(false);
      await migrations.runMigrations();
      expect(await runner.hasTable('auth_identity')).toBe(true);
      expect(await runner.hasColumn('user', 'cognito_id')).toBe(false);
      expect(await runner.hasTable('public_keys')).toBe(false);
    } finally {
      await runner.release();
      await migrations.destroy();
    }
  });

  it('the email-lower-unique migration refuses to run over case duplicates', async () => {
    const migrations = await openMigrationDataSource();
    try {
      await migrations.undoLastMigration(); // DropCognitoLegacy
      await migrations.undoLastMigration(); // drop the index
      await createUser('dup@ong.ro');
      await createUser('DUP@ong.ro');
      await expect(migrations.runMigrations()).rejects.toThrow(
        /case-insensitive duplicate/,
      );
      await truncate(ds, ['user']);
      await migrations.runMigrations();
    } finally {
      await migrations.destroy();
    }
  });

  it('user.email is unique case-insensitively', async () => {
    await createUser('ana@ong.ro');
    await expect(createUser('ANA@ong.ro')).rejects.toBeInstanceOf(
      QueryFailedError,
    );
  });

  it('one identity per user; finds it by id, userId and email (any case); refuses empty lookups', async () => {
    const userId = await createUser('Ana@Ong.ro');
    const identity = await facade.createIdentity({ userId });

    await expect(facade.createIdentity({ userId })).rejects.toBeInstanceOf(
      QueryFailedError,
    );
    expect((await facade.findIdentity({ id: identity.id }))?.userId).toBe(
      userId,
    );
    expect((await facade.findIdentity({ userId }))?.id).toBe(identity.id);
    expect((await facade.findIdentity({ email: ' ana@ONG.ro ' }))?.id).toBe(
      identity.id,
    );

    expect(await facade.findIdentity({ userId: undefined })).toBeNull();
    expect(await facade.findIdentity({ id: null })).toBeNull();
    expect(await facade.findIdentity({ email: '' })).toBeNull();
  });

  it('upsert is idempotent', async () => {
    const userId = await createUser('b@ong.ro');
    const verified = new Date('2026-01-01T00:00:00Z');
    const first = await facade.upsertIdentity({
      userId,
      emailVerifiedAt: verified,
    });
    const second = await facade.upsertIdentity({
      userId,
      emailVerifiedAt: new Date('2026-06-01T00:00:00Z'),
    });
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(second.identity.id).toBe(first.identity.id);
    // The first write wins: an upsert never overwrites an existing identity.
    expect(second.identity.emailVerifiedAt).toEqual(verified);
  });

  it('a token is consumed once, attempts are capped, live tokens are replaced', async () => {
    const userId = await createUser('c@ong.ro');
    const { id: identityId } = await facade.createIdentity({ userId });
    const token = await facade.createToken({
      identityId,
      type: AuthTokenType.LOGIN,
      form: AuthTokenForm.CODE,
      tokenHash: 'hash-1',
      expiresAt: inAnHour(),
      sentTo: 'c@ong.ro',
    });

    expect(await facade.claimTokenAttempt(token.id, 2)).toBe(1);
    expect(await facade.claimTokenAttempt(token.id, 2)).toBe(2);
    expect(await facade.claimTokenAttempt(token.id, 2)).toBeNull();

    const [a, b] = await Promise.all([
      facade.consumeToken(token.id),
      facade.consumeToken(token.id),
    ]);
    expect([a, b].filter(Boolean)).toHaveLength(1);
    expect(await facade.findTokenByHash('hash-1')).toBeNull(); // used = not live
    expect((await facade.findAnyTokenByHash('hash-1'))?.usedAt).toBeTruthy();

    await facade.createToken({
      identityId,
      type: AuthTokenType.LOGIN,
      form: AuthTokenForm.LINK,
      tokenHash: 'hash-2',
      expiresAt: inAnHour(),
    });
    expect(
      await facade.replaceLiveTokens(identityId, [AuthTokenType.LOGIN]),
    ).toBe(1);
    expect(
      await facade.findLiveToken(identityId, AuthTokenType.LOGIN),
    ).toBeNull();
  });

  it('a refresh token rotates once under a race; revoke and revoke-all', async () => {
    const userId = await createUser('d@ong.ro');
    const { id: identityId } = await facade.createIdentity({ userId });
    const session = await facade.createSession({
      identityId,
      tokenHash: 'r-1',
      expiresAt: inAnHour(),
    });
    expect(
      (await facade.findIdentity({ id: identityId })).lastLoginAt,
    ).toBeTruthy();

    const [x, y] = await Promise.all([
      facade.rotateSession(session.id, 'r-1', 'r-2a', inAnHour()),
      facade.rotateSession(session.id, 'r-1', 'r-2b', inAnHour()),
    ]);
    expect([x, y].filter(Boolean)).toHaveLength(1);
    expect((await facade.findSessionByPreviousHash('r-1'))?.id).toBe(
      session.id,
    );

    const other = await facade.createSession({
      identityId,
      tokenHash: 'r-9',
      expiresAt: inAnHour(),
    });
    expect(await facade.revokeAllSessions(identityId, other.id)).toBe(1);
    expect(await facade.revokeSession(other.id)).toBe(true);
    expect(await facade.revokeSession(other.id)).toBe(false);
  });

  it('deleting the user cascades to identity, tokens and sessions; sent_by is nulled', async () => {
    const adminId = await createUser('admin@ong.ro');
    const userId = await createUser('e@ong.ro');
    const { id: identityId } = await facade.createIdentity({ userId });
    const { id: adminIdentityId } = await facade.createIdentity({
      userId: adminId,
    });
    await facade.createToken({
      identityId,
      type: AuthTokenType.INVITE,
      form: AuthTokenForm.LINK,
      tokenHash: 'inv-1',
      expiresAt: inAnHour(),
      sentById: adminId,
    });
    await facade.createSession({
      identityId,
      tokenHash: 's-1',
      expiresAt: inAnHour(),
    });
    await facade.createToken({
      identityId: adminIdentityId,
      type: AuthTokenType.LOGIN,
      form: AuthTokenForm.LINK,
      tokenHash: 'adm-1',
      expiresAt: inAnHour(),
      sentById: userId,
    });

    await ds.query(`DELETE FROM "user" WHERE id = $1`, [userId]);

    expect(await facade.findIdentity({ id: identityId })).toBeNull();
    const [{ count }] = await ds.query(
      `SELECT (SELECT count(*) FROM auth_token WHERE identity_id = $1) + (SELECT count(*) FROM refresh_token WHERE identity_id = $1) AS count`,
      [identityId],
    );
    expect(Number(count)).toBe(0);
    expect((await facade.findAnyTokenByHash('adm-1')).sentById).toBeNull();
  });

  it('deleteByUserId removes only that identity', async () => {
    const u1 = await createUser('f@ong.ro');
    const u2 = await createUser('g@ong.ro');
    await facade.createIdentity({ userId: u1 });
    await facade.createIdentity({ userId: u2 });
    expect(await facade.deleteByUserId(undefined)).toBe(0);
    expect(await facade.deleteByUserId(u1)).toBe(1);
    expect(await facade.findIdentity({ userId: u2 })).not.toBeNull();
  });
});
