import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationGeneralAddressField1684417364617
  implements MigrationInterface
{
  name = 'AddOrganizationGeneralAddressField1684417364617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" ADD "address" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_general" DROP COLUMN "address"`,
    );
  }
}
