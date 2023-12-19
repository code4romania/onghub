import { MigrationInterface, QueryRunner } from 'typeorm';

export class OptionalFields1700744868195 implements MigrationInterface {
  name = 'OptionalFields1700744868195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "_contact" ALTER COLUMN "phone" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ALTER COLUMN "website" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "video_link" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application" ALTER COLUMN "video_link" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_general" ALTER COLUMN "website" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "_contact" ALTER COLUMN "phone" SET NOT NULL`,
    );
  }
}
