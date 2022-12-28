import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropContact1672232907420 implements MigrationInterface {
  name = 'DropContact1672232907420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP CONSTRAINT "FK_d4b57646df8b80c7d33743d45e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" RENAME COLUMN "contact_id" TO "contact_person"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" RENAME CONSTRAINT "UQ_d4b57646df8b80c7d33743d45e2" TO "UQ_61efc4e6508de3e80565b1ca151"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP CONSTRAINT "UQ_61efc4e6508de3e80565b1ca151"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "contact_person"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "contact_person" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
