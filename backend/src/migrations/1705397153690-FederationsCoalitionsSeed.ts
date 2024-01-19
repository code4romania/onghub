import { MigrationInterface, QueryRunner } from 'typeorm';
import { FEDERATIONS } from './seed/federations.seed';
import { COALITIONS } from './seed/coalitions.seed';
import { Federation, Coalition } from 'src/shared/entities';

export class FederationsCoalitionsSeed1705397153690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Federation)
      .values(FEDERATIONS)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Coalition)
      .values(COALITIONS)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Coalition)
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Federation)
      .execute();
  }
}
