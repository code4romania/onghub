import { MigrationInterface, QueryRunner } from 'typeorm';
import { Domain } from 'src/shared/entities';
import { DOMAINS } from './seed/domains.seed';

export class DomainsSeed1657199669928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Domain)
      .values(DOMAINS)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.createQueryBuilder().delete().from(Domain)
      .execute;
  }
}
