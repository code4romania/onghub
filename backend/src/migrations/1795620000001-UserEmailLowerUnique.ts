import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Login looks the user up by email, case-insensitively. `user.email` is only
 * unique case-sensitively today, so two rows can differ by case. Run
 * backend/scripts/auth-preflight.sql first: this migration refuses to run
 * (and so blocks the deploy) while such duplicates exist, instead of picking one.
 */
export class UserEmailLowerUnique1795620000001 implements MigrationInterface {
  name = 'UserEmailLowerUnique1795620000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const duplicates: { email: string; count: number }[] =
      await queryRunner.query(`
        SELECT lower("email") AS email, count(*)::int AS count
        FROM "user"
        GROUP BY lower("email")
        HAVING count(*) > 1`);
    if (duplicates.length) {
      throw new Error(
        `user.email has ${duplicates.length} case-insensitive duplicate(s); ` +
          'resolve them (backend/scripts/auth-preflight.sql) before deploying.',
      );
    }
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_email_lower_unique" ON "user" (lower("email"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "user_email_lower_unique"`);
  }
}
