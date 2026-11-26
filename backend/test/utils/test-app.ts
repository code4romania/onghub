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
import { FakeMailService } from './fake-mail.service';
import { migrateTestDatabase } from './test-data-source';

export interface TestApp {
  app: NestExpressApplication;
  dataSource: DataSource;
  mailbox: FakeMailService;
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
 * mail faked. Expects test/setup-env.ts (jest-e2e.json setupFiles).
 */
export async function createTestApp(
  options: TestAppOptions = {},
): Promise<TestApp> {
  // Creates and migrates the database before the app connects to it.
  await migrateTestDatabase();

  const mailbox = new FakeMailService();
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(MailService)
    .useValue(mailbox);
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
    flushRedis: async () => {
      // Only this worker's test prefixes; never a shared Redis.
      const prefixes = [
        process.env.BULL_PREFIX && `${process.env.BULL_PREFIX}:`,
        process.env.REDIS_KEY_PREFIX,
      ].filter((p) => p?.startsWith('test'));
      if (!prefixes.length) return;
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      });
      try {
        for (const prefix of prefixes) {
          const keys = await redis.keys(`${prefix}*`);
          if (keys.length) await redis.del(...keys);
        }
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
