import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocialAddress1705510581013 implements MigrationInterface {
  name = 'AddSocialAddress1705510581013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "organization_address" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "organization_city_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "organization_county_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ALTER COLUMN "address" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD CONSTRAINT "FK_7094eb25b77161e0438a990429d" FOREIGN KEY ("organization_city_id") REFERENCES "_city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD CONSTRAINT "FK_2bc48adab088142998678abbb7d" FOREIGN KEY ("organization_county_id") REFERENCES "_county"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP CONSTRAINT "FK_2bc48adab088142998678abbb7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP CONSTRAINT "FK_7094eb25b77161e0438a990429d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ALTER COLUMN "address" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "organization_county_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "organization_city_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "organization_address"`,
    );
  }
}
