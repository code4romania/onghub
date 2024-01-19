import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVideLinkOptionalInHistory1705667201946
  implements MigrationInterface
{
  name = 'AddVideLinkOptionalInHistory1705667201946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_history" ALTER COLUMN "video_link" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_history" ALTER COLUMN "video_link" SET NOT NULL`,
    );
  }
}
