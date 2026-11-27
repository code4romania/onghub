/**
 * Own-auth cutover (plan 6.1, phase 3). Run backend/scripts/auth-preflight.sql first.
 *
 *   npm run auth:migrate -- --dry-run      counts only, writes nothing
 *   npm run auth:migrate                   identities + transition emails (held)
 *   npm run auth:migrate -- --release      start sending the held emails
 *   npm run auth:migrate -- --drop         rollback: forget the held emails
 *   npm run auth:migrate -- --status       how many are still held
 *
 * Runs against whatever DATABASE_* / REDIS_* the environment points at:
 * check them before running.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthMigrationService } from '../modules/authentication/services/auth-migration.service';

async function main() {
  const args = new Set(process.argv.slice(2));
  const known = ['--dry-run', '--release', '--drop', '--status'];
  for (const arg of args)
    if (!known.includes(arg)) throw new Error(`Unknown argument ${arg}`);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const migration = app.get(AuthMigrationService, { strict: false });
    let result: unknown;
    if (args.has('--release')) result = await migration.release();
    else if (args.has('--drop'))
      result = (await migration.drop(), { dropped: true });
    else if (args.has('--status')) result = { held: await migration.pending() };
    else result = await migration.migrate({ dryRun: args.has('--dry-run') });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } finally {
    await app.close().catch(() => undefined);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    process.stderr.write(`${error?.message ?? error}\n`);
    process.exit(1);
  },
);
