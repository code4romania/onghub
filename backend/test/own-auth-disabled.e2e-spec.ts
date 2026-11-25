// AppModule first: importing auth files before it trips a circular import.
import { createTestApp, TestApp } from './utils/test-app';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { AuthConfigService } from 'src/common/config/auth.config';
import { UserService } from 'src/modules/user/services/user.service';
import { OrganizationService } from 'src/modules/organization/services';
import { ACTIVE_JWT_STRATEGY } from 'src/modules/authentication/auth.module';
import { JwtStrategy } from 'src/modules/authentication/jwt.strategy';
import { OwnJwtStrategy } from 'src/modules/authentication/strategies/own-jwt.strategy';

/** Staging/production today: no own-auth keys. Nothing may change. */
describe('own auth disabled (no keys)', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    // ConfigService.get reads process.env first, so a stub (not new ConfigService(...)).
    const blank = ['JWT_PRIVATE_KEY', 'JWT_PUBLIC_KEY', 'AUTH_TOKEN_KEY'];
    const withoutKeys = {
      get: (key: string) =>
        blank.includes(key) ? undefined : process.env[key],
    } as unknown as ConfigService;
    testApp = await createTestApp({
      override: (b) =>
        b
          .overrideProvider(AuthConfigService)
          .useValue(new AuthConfigService(withoutKeys)),
    });
  });

  afterAll(() => testApp?.close());

  it('keeps the Cognito strategy', () => {
    const strategy = testApp.app.get(ACTIVE_JWT_STRATEGY);
    expect(strategy).toBeInstanceOf(JwtStrategy);
    expect(strategy).not.toBeInstanceOf(OwnJwtStrategy);
  });

  it('own-auth endpoints answer 404 and send nothing', async () => {
    const server = testApp.app.getHttpServer();
    await request(server)
      .post('/auth/web/login/request')
      .send({ email: 'a@ong.ro' })
      .expect(404);
    await request(server)
      .post('/auth/login-link')
      .send({ token: 'x' })
      .expect(404);
    await request(server).post('/auth/web/refresh').expect(404);
    expect(testApp.mailbox.sent).toHaveLength(0);
  });

  it('protected routes still require a (Cognito) token', async () => {
    await request(testApp.app.getHttpServer()).get('/profile').expect(401);
  });

  it('creating and restricting users still goes through Cognito', async () => {
    jest
      .spyOn(testApp.app.get(OrganizationService), 'findWithRelations')
      .mockImplementation(async (id: number) => ({ id }) as any);
    const [{ id: orgId }] = await testApp.dataSource.query(
      `INSERT INTO organization (status) VALUES ('active') RETURNING id`,
    );
    const users = testApp.app.get(UserService);
    const user = await users.createEmployee({
      name: 'Cognito User',
      email: `cognito-${Date.now()}@ong.ro`,
      phone: `+4073${String(Date.now()).slice(-7)}`,
      organizationId: orgId,
      applicationAccess: [],
    });
    await users.restrictAccess([user.id]);

    expect(user.cognitoId).toMatch(/^test-cognito-/);
    expect(testApp.cognito.calls.map((c) => c.method)).toEqual([
      'createUser',
      'globalSignOut',
    ]);
    expect(testApp.mailbox.sent).toHaveLength(0); // Cognito sends its own invitation
  });
});
