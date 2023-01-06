import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgeCategoriesToArray1672757115641 implements MigrationInterface {
  name = 'AgeCategoriesToArray1672757115641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" DROP COLUMN "age_categories"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."civic_center_service_age_categories_enum" AS ENUM('0-18', '18-25', '25-35', '35-60', '60+')`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" ADD "age_categories" "public"."civic_center_service_age_categories_enum" array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" DROP COLUMN "age_categories"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."civic_center_service_age_categories_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" ADD "age_categories" text NOT NULL`,
    );
  }
}
