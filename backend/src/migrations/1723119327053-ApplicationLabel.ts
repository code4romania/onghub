import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicationLabel1723119327053 implements MigrationInterface {
  name = 'ApplicationLabel1723119327053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "_application-label" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_c0aaf1127ad3beeaf0d3ad70096" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4a4e4b1582c4e665cff9be33e" ON "_application-label" ("created_on") `,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "application_label_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD CONSTRAINT "FK_318029631a770782ba1c66721fd" FOREIGN KEY ("application_label_id") REFERENCES "_application-label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" DROP CONSTRAINT "FK_318029631a770782ba1c66721fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "application_label_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4a4e4b1582c4e665cff9be33e"`,
    );
    await queryRunner.query(`DROP TABLE "_application-label"`);
  }
}
