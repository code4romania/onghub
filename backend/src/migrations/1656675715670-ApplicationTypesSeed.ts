import { ApplicationType } from 'src/shared/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { APPLICATION_TYPES } from './seed/application-types.seed';

export class ApplicationTypesSeed1656675715670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ApplicationType)
      .values(APPLICATION_TYPES)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(ApplicationType).execute;
  }
}
