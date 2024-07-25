import { MigrationInterface, QueryRunner } from 'typeorm';
import { ISSUERS } from './seed/issuers.seed';
import { Issuer } from 'src/shared/entities';
export class AddIssuer1721896584559 implements MigrationInterface {
  name = 'AddIssuer1721896584559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "_issuer" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_cfe878b7aa3dc098f2ac736adc6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20b3d0cad6a13638d5d485eada" ON "_issuer" ("created_on") `,
    );
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Issuer)
      .values(ISSUERS)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Issuer)
      .execute();

    await queryRunner.query(
      `DROP INDEX "public"."IDX_20b3d0cad6a13638d5d485eada"`,
    );
    await queryRunner.query(`DROP TABLE "_issuer"`);
  }
}
