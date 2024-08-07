import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinancialStatus1723034111334 implements MigrationInterface {
  name = 'FinancialStatus1723034111334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new values to the existing enums
    await queryRunner.query(
      `ALTER TYPE "public"."organization_financial_completion_status_enum" ADD VALUE IF NOT EXISTS 'Invalid'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_financial_completion_status_enum" ADD VALUE IF NOT EXISTS 'Pending'`,
    );

    await queryRunner.query(
      `ALTER TYPE "public"."organization_completion_status_enum" ADD VALUE IF NOT EXISTS 'Invalid'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_completion_status_enum" ADD VALUE IF NOT EXISTS 'Pending'`,
    );

    await queryRunner.query(
      `ALTER TYPE "public"."partner_status_enum" ADD VALUE IF NOT EXISTS 'Invalid'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."partner_status_enum" ADD VALUE IF NOT EXISTS 'Pending'`,
    );

    await queryRunner.query(
      `ALTER TYPE "public"."report_status_enum" ADD VALUE IF NOT EXISTS 'Invalid'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."report_status_enum" ADD VALUE IF NOT EXISTS 'Pending'`,
    );

    await queryRunner.query(
      `ALTER TYPE "public"."investor_status_enum" ADD VALUE IF NOT EXISTS 'Invalid'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."investor_status_enum" ADD VALUE IF NOT EXISTS 'Pending'`,
    );

    // Add new column with the enum type
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "financial_completion_status" "public"."organization_financial_completion_status_enum" NOT NULL DEFAULT 'Not Completed'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the new column
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "financial_completion_status"`,
    );

    // Note: Removing values from an ENUM type in PostgreSQL is not supported.
    // We should create a new enum type without the extra values if we need to revert.
  }
}
