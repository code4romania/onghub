import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewGeneralFields1721829705666 implements MigrationInterface {
  name = 'NewGeneralFields1721829705666';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "organization_general" ADD "association_registry_issuer" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "national_registry_number" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "national_registry_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "association_registry_issuer"`,
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
