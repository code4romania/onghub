/**
 * Super admins (plan 5.5). Every change goes to auth_event.
 *
 *   npm run auth:super-admin                                   list them
 *   npm run auth:super-admin -- --add <email> --name "<name>" [--phone <phone>]
 *                                                              create + invite (link + code, 30 days)
 *   npm run auth:super-admin -- --remove <email>               restrict + end every session
 *
 * Runs against whatever DATABASE_* / REDIS_* / MAIL_* the environment points
 * at: check them before running.
 */
import { NestFactory } from '@nestjs/core';
import { SuperAdminService } from '../modules/authentication/services/super-admin.service';
import { parseArgs } from './auth-super-admin.args';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // Loaded here, not at the top: importing AppModule validates the environment (the unit test of parseArgs has none).
  const { AppModule } = await import('../app.module');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const superAdmins = app.get(SuperAdminService, { strict: false });
    if (args.add) {
      const added = await superAdmins.add({
        email: args.add,
        name: args.name,
        phone: args.phone,
      });
      process.stdout.write(`added and invited: ${JSON.stringify(added)}\n`);
    } else if (args.remove) {
      const removed = await superAdmins.remove(args.remove);
      process.stdout.write(`restricted: ${JSON.stringify(removed)}\n`);
    }
    const all = await superAdmins.list();
    process.stdout.write(`super admins (${all.length}):\n`);
    for (const s of all) process.stdout.write(`  ${s.email} (${s.status})\n`);
  } finally {
    await app.close().catch(() => undefined);
  }
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (error) => {
      process.stderr.write(`${error?.message ?? error}\n`);
      process.exit(1);
    },
  );
}
