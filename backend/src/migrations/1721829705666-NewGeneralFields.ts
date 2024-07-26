import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewGeneralFields1721829705666 implements MigrationInterface {
  name = 'NewGeneralFields1721829705666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" ALTER COLUMN "raf_number" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "association_registry_number" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "association_registry_part" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "association_registry_section" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "association_registry_issuer_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD CONSTRAINT "FK_302f085592ed8a6c5d06f1182ef" FOREIGN KEY ("association_registry_issuer_id") REFERENCES "_issuer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "national_registry_number" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" ALTER COLUMN "raf_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "national_registry_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP CONSTRAINT "FK_302f085592ed8a6c5d06f1182ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "association_registry_issuer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "association_registry_section"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "association_registry_part"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "association_registry_number"`,
    );
  }
}
