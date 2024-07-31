import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContactRole1722423180665 implements MigrationInterface {
  name = 'ContactRole1722423180665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "_contact" ADD "role" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "_contact" DROP COLUMN "role"`);
  }
}
