import { MigrationInterface, QueryRunner } from 'typeorm';
import { REGIONS } from './seed/regions.seed';
import { Region } from 'src/shared/entities';

export class RegionsSeed1657272929004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Region)
      .values(REGIONS)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.createQueryBuilder().delete().from(Region)
      .execute;
  }
}
