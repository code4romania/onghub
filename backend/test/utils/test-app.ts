import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Queue } from 'bull';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { setupApp } from 'src/app.setup';
import { QUEUES } from 'src/common/constants/queues.constants';
import { MailService } from 'src/mail/services/mail.service';
import { CognitoUserService } from 'src/modules/user/services/cognito.service';
import { FakeMailService } from './fake-mail.service';
import { FakeCognitoUserService } from './fake-cognito.service';
import { migrateTestDatabase } from './test-data-source';

export interface TestApp {
  app: NestExpressApplication;
  dataSource: DataSource;
  mailbox: FakeMailService;
  cognito: FakeCognitoUserService;
  /** Deletes this worker's Bull keys (BULL_PREFIX) from the local Redis. */
  flushRedis(): Promise<void>;
  close(): Promise<void>;
}

export interface TestAppOptions {
  /** Extra overrides on top of the default fakes. */
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder;
}

/**
 * Boots the whole AppModule against the worker's local test database, with
 * mail and Cognito faked. Expects test/setup-env.ts (jest-e2e.json setupFiles).
 */
export async function createTestApp(
  options: TestAppOptions = {},
): Promise<TestApp> {
  // Creates and migrates the database before the app connects to it.
  await migrateTestDatabase();

  const mailbox = new FakeMailService();
  const cognito = new FakeCognitoUserService();
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(MailService)
    .useValue(mailbox)
    .overrideProvider(CognitoUserService)
    .useValue(cognito);
  if (options.override) builder = options.override(builder);

  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>({
    bodyParser: false, // as in main.ts: AppModule installs its own parsers
  });
  setupApp(app);
  // Listen once on the address supertest connects to (instead of a new port per request).
  await app.listen(0, '127.0.0.1');

  return {
    app,
    dataSource: app.get(DataSource),
    mailbox,
    cognito,
    flushRedis: async () => {
      const prefix = process.env.BULL_PREFIX;
      if (!prefix?.startsWith('test-')) return; // never flush a shared Redis
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      });
      try {
        const keys = await redis.keys(`${prefix}:*`);
        if (keys.length) await redis.del(...keys);
      } finally {
        redis.disconnect();
      }
    },
    // Bull rejects a connection still connecting when its queue closes; wait first.
    close: async () => {
      await Promise.all(
        Object.values(QUEUES).map((name) =>
          app.get<Queue>(getQueueToken(name)).isReady(),
        ),
      );
      // cache-manager-redis-store's client is not closed by Nest on shutdown
      // and would keep Jest alive.
      const cache = app.get(CACHE_MANAGER, { strict: false });
      const cacheClient = cache?.store?.getClient?.();
      await app.close();
      await new Promise<void>((resolve) =>
        cacheClient ? cacheClient.quit(() => resolve()) : resolve(),
      );
    },
  };
}
