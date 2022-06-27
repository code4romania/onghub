import { County, City } from 'src/shared/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { CITIES } from './seed/city.seed';
import { COUNTIES } from './seed/counties.sees';

export class CitiesCountiesSeed1656251105434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }
}
