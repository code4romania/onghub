import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPhoneNullable1724932441086 implements MigrationInterface {
  name = 'UserPhoneNullable1724932441086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_history" ALTER COLUMN "phone" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_history" ALTER COLUMN "phone" SET NOT NULL`,
    );
  }
}
