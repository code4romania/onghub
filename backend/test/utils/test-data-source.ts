import { DataSource } from 'typeorm';

const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

/**
 * Connection for specs that need Postgres: the local docker compose server
 * only. Throws for any other host, so a spec can never touch staging or
 * production even if the environment is wrong.
 */
export function testConnectionOptions(env: NodeJS.ProcessEnv = process.env) {
  const host = env.DATABASE_HOST;
  if (!LOCAL_HOSTS.includes(host)) {
    throw new Error(
      `Database specs only run against a local database; DATABASE_HOST is "${host}".`,
    );
  }
  const database = env.DATABASE_NAME;
  if (!/^onghub_test(_\w+)?_\d+$/.test(database ?? '')) {
    throw new Error(
      `Database specs only run against an onghub_test_<worker> database; got "${database}".`,
    );
  }

  return {
    host,
    port: +env.DATABASE_PORT,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database,
  };
}

/** One database per Jest worker, so parallel suites never truncate each other's rows. */
export function testDatabaseName(): string {
  return `${process.env.DATABASE_TEST_NAME || 'onghub_test'}_${process.env.JEST_WORKER_ID ?? '1'}`;
}

async function ensureDatabase(
  options: ReturnType<typeof testConnectionOptions>,
): Promise<void> {
  const admin = new DataSource({
    type: 'postgres',
    ...options,
    database: 'postgres',
  });
  await admin.initialize();
  try {
    const rows = await admin.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [options.database],
    );
    if (!rows.length) {
      await admin.query(`CREATE DATABASE "${options.database}"`);
    }
  } finally {
    await admin.destroy();
  }
}

/** Creates the worker's test database if needed and applies every migration (from src, not dist). */
export async function migrateTestDatabase(): Promise<void> {
  const options = testConnectionOptions();
  await ensureDatabase(options);

  const dataSource = new DataSource({
    type: 'postgres',
    ...options,
    // View entities make TypeORM create typeorm_metadata, which the DDL migration needs.
    entities: [`${__dirname}/../../src/**/*.entity.ts`],
    migrations: [`${__dirname}/../../src/migrations/*.ts`],
    synchronize: false,
  });
  await dataSource.initialize();
  try {
    await dataSource.runMigrations({ transaction: 'each' });
  } finally {
    await dataSource.destroy();
  }
}

/**
 * Empties the tables a spec writes to; CASCADE also clears rows that
 * reference them. Deadlocks with async history subscribers are retried.
 */
export async function truncate(
  dataSource: DataSource,
  tables: string[],
): Promise<void> {
  const sql = `TRUNCATE ${tables.map((t) => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE`;
  for (let attempt = 1; ; attempt++) {
    try {
      await dataSource.query(sql);
      return;
    } catch (error) {
      const deadlock = (error as { code?: string }).code === '40P01';
      if (!deadlock || attempt >= 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
}
