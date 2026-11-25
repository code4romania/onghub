import { MailService } from 'src/mail/services/mail.service';
import { createTestApp, TestApp } from './utils/test-app';
import { testConnectionOptions, truncate } from './utils/test-data-source';
import { api } from './utils/http';

// Proves the harness the later layers (O4+) build on.
describe('e2e harness', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp?.close();
  });

  beforeEach(() => testApp.mailbox.clear());

  it('boots AppModule on the worker test database with all migrations', async () => {
    const [{ current_database }] = await testApp.dataSource.query(
      'SELECT current_database()',
    );
    expect(current_database).toMatch(/^onghub_test_\d+$/);

    const [{ count }] = await testApp.dataSource.query(
      'SELECT count(*)::int AS count FROM migrations',
    );
    expect(count).toBeGreaterThan(0);

    await api(testApp.app).get('/health').expect(200);
  });

  it('sends email to the fake mailbox, not the queue', async () => {
    await testApp.app
      .get(MailService)
      .sendEmail({ to: 'ana@ong.test', subject: 'hello' });
    expect(testApp.mailbox.last('ana@ong.test')?.subject).toBe('hello');
  });

  it('truncates tables', async () => {
    await truncate(testApp.dataSource, ['user']);
    const [{ count }] = await testApp.dataSource.query(
      'SELECT count(*)::int AS count FROM "user"',
    );
    expect(count).toBe(0);
  });

  it('never reads the developer .env (blanked) and uses no remote host', () => {
    expect(process.env.DATABASE_HOST).toBe('localhost');
    expect(process.env.BULL_PREFIX).toMatch(/^test-ngohub-\d+$/);
  });

  it('refuses remote database hosts and non-test databases', () => {
    expect(() =>
      testConnectionOptions({
        DATABASE_HOST: 'onghub-staging.example.rds.amazonaws.com',
        DATABASE_NAME: 'onghub_test_1',
      }),
    ).toThrow(/local database/);
    expect(() =>
      testConnectionOptions({
        DATABASE_HOST: 'localhost',
        DATABASE_NAME: 'onghub',
      }),
    ).toThrow(/onghub_test/);
  });
});
