import { MigrationInterface, QueryRunner } from 'typeorm';
import { Region, County, City } from 'src/shared/entities';
import { REGIONS } from './seed/regions.seed';
import { COUNTIES } from './seed/counties.sees';
import { CITIES } from './seed/city.seed';

export class RegionsCountiesCitiesSeed1657620427335
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Region)
      .values(REGIONS)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(County)
      .values(COUNTIES)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(City)
      .values(CITIES.slice(0, 5000))
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(City)
      .values(CITIES.slice(5000, 10000))
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(City)
      .values(CITIES.slice(10000))
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(City)
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(County)
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Region)
      .execute();
  }
}
