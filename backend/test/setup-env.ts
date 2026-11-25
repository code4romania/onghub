import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { testDatabaseName } from './utils/test-data-source';

// Jest setupFiles for the e2e suite: runs before AppModule is imported.
//
// backend/.env is a developer's file and may point at staging (it did when
// this was written). ConfigModule would read it for every key missing from
// process.env, so: blank every key it defines, then load the complete
// .env.test on top. Real process.env values from the shell are kept only for
// keys .env.test does not set.
const root = join(__dirname, '..');
const devEnv = join(root, '.env');
if (existsSync(devEnv)) {
  for (const key of Object.keys(dotenv.parse(readFileSync(devEnv)))) {
    process.env[key] = '';
  }
}
dotenv.config({ path: join(root, '.env.test'), override: true });

Object.assign(process.env, {
  DATABASE_NAME: testDatabaseName(),
  // Queues per Jest worker, like the databases: suites never take each other's jobs.
  BULL_PREFIX: `${process.env.BULL_PREFIX || 'test-ngohub'}-${process.env.JEST_WORKER_ID ?? '1'}`,
});
