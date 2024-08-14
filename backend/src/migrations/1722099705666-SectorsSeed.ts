import { City } from 'src/shared/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { SECTORS } from './seed/sectors.seed';

export class SectorsSeed1722099705666 implements MigrationInterface {
  name = 'SectorsSeed1722099705666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(City)
      .values(SECTORS)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sectorIds = SECTORS.map((sector) => sector.id);

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(City)
      .where('id IN (:...ids)', { ids: sectorIds })
      .execute();
  }
}
