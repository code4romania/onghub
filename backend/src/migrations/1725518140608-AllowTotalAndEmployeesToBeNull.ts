import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowTotalAndEmployeesToBeNull1725518140608
  implements MigrationInterface
{
  name = 'AllowTotalAndEmployeesToBeNull1725518140608';

  /**
   *  Allow Total and Employees to be null to better reflect if the user has not completed the financials or is just the default value
   */

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "number_of_employees" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "number_of_employees" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "total" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "total" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "total" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "total" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "number_of_employees" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ALTER COLUMN "number_of_employees" SET NOT NULL`,
    );
  }
}
