/**
 * Writes NGO Hub's ACTIVE organizations for a client app to link its own
 * records (VIC: `npm run ngohub:link-orgs -- --file <this file>`):
 * id, CUI, name, contact email and phone. Run it on the same environment as
 * the client (an id from staging means nothing in production).
 *
 *   npm run oidc:export-orgs -- --out ngohub-orgs.json
 */
import { writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

export interface ExportedOrganization {
  id: number;
  cui: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export async function exportOrganizations(
  dataSource: DataSource,
): Promise<ExportedOrganization[]> {
  return dataSource.query(
    `SELECT o.id, g.cui, g.name, g.email, g.phone
       FROM organization o
       JOIN organization_general g ON g.id = o.organization_general_id
      WHERE o.status = 'active' AND o.deleted_on IS NULL
      ORDER BY o.id`,
  );
}

async function main() {
  const argv = process.argv.slice(2);
  const outIndex = argv.indexOf('--out');
  const out = outIndex >= 0 ? argv[outIndex + 1] : undefined;
  if (!out) throw new Error('--out <file.json> is required');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const organizations = await exportOrganizations(app.get(DataSource));
    writeFileSync(out, JSON.stringify(organizations, null, 2));
    process.stdout.write(`${organizations.length} organizations -> ${out}\n`);
  } finally {
    await app.close().catch(() => undefined);
  }
}

// Exit explicitly: Bull/Redis/cron handles from AppModule keep the process alive.
if (require.main === module) {
  main().then(
    () => process.exit(0),
    (error) => {
      process.stderr.write(`${error?.message ?? error}\n`);
      process.exit(1);
    },
  );
}
