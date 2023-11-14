import { MigrationInterface, QueryRunner } from 'typeorm';

export class SynchedAnaf1699889886586 implements MigrationInterface {
  name = 'SynchedAnaf1699889886586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ADD "synched_anaf" boolean NOT NULL DEFAULT false`,
    );

    // Update existing rows to set the default value
    await queryRunner.query(
      `UPDATE "organization_financial" SET "synched_anaf" = false WHERE "synched_anaf" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_financial" DROP COLUMN "synched_anaf"`,
    );
  }
}
