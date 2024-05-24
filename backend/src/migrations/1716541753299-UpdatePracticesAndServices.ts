import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePracticesAndServices1716541753299
  implements MigrationInterface
{
  name = 'UpdatePracticesAndServices1716541753299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "civic_center_service" set "age_categories" = '{}'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."civic_center_service_age_categories_enum" RENAME TO "civic_center_service_age_categories_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."civic_center_service_age_categories_enum" AS ENUM('COPII', 'TINERI', 'ADULTI', 'VARSTNICI', 'FAMILIE', 'RISC_DE_SARACIE', 'ADICTII', 'AFECTIUNI_MEDICALE', 'AFECTIUNI_PSIHICE', 'DIZABILITATI', 'COMUNITATI_IZOLATE', 'FARA_ADAPOST', 'PRIVATE_DE_LIBERTATE', 'TRAFICULUI_DE_PERSOANE', 'VIOLENTEI_DOMESTICE', 'SOMERI', 'APARTINATORII_BENEFICIARILOR')`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" ALTER COLUMN "age_categories" TYPE "public"."civic_center_service_age_categories_enum"[] USING "age_categories"::"text"::"public"."civic_center_service_age_categories_enum"[]`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."civic_center_service_age_categories_enum_old"`,
    );
    await queryRunner.query(`DELETE FROM "civic_center_service_to_domain"`);
    await queryRunner.query(`DELETE FROM "practice_program_to_domain"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "civic_center_service" set "age_categories" = '{}'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."civic_center_service_age_categories_enum_old" AS ENUM('0-18', '18-25', '25-35', '35-60', '60+')`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" ALTER COLUMN "age_categories" TYPE "public"."civic_center_service_age_categories_enum_old"[] USING "age_categories"::"text"::"public"."civic_center_service_age_categories_enum_old"[]`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."civic_center_service_age_categories_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."civic_center_service_age_categories_enum_old" RENAME TO "civic_center_service_age_categories_enum"`,
    );
  }
}
