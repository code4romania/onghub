import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFinancialReportStatus1724056332367
  implements MigrationInterface
{
  name = 'AddNewFinancialReportStatus1724056332367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."organization_financial_status_enum" AS ENUM('Not Completed', 'Pending', 'Completed', 'Invalid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_financial" ADD "status" "public"."organization_financial_status_enum" NOT NULL DEFAULT 'Not Completed'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_financial" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_financial_status_enum"`,
    );
  }
}
