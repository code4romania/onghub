import { MigrationInterface, QueryRunner } from 'typeorm';

export class BalanceSheetAndNonPoliticalAffiliation1721632351165
  implements MigrationInterface
{
  name = 'BalanceSheetAndNonPoliticalAffiliation1721632351165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_legal" ADD "balance_sheet_file" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_legal" ADD "non_political_affiliation_file" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_legal" DROP COLUMN "non_political_affiliation_file"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_legal" DROP COLUMN "balance_sheet_file"`,
    );
  }
}
