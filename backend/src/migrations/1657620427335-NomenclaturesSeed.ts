import { MigrationInterface, QueryRunner } from 'typeorm';
import { Region, County, City } from 'src/shared/entities';
import { REGIONS } from './seed/regions.seed';
import { COUNTIES } from './seed/counties.sees';
import { CITIES } from './seed/city.seed';
import { FEDERATIONS } from './seed/federations.seed';
import { COALITIONS } from './seed/coalitions.seed';
import { Federation, Coalition } from 'src/shared/entities';
import { Faculty, Skill } from 'src/shared/entities';
import { FACULTIES } from './seed/faculties.seed';
import { SKILLS } from './seed/skills.seed';
import { Domain } from 'src/shared/entities';
import { DOMAINS } from './seed/domains.seed';

export class NomenclaturesSeed1657620427335 implements MigrationInterface {
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

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Faculty)
      .values(FACULTIES)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Skill)
      .values(SKILLS)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Domain)
      .values(DOMAINS)
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
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Faculty)
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Skill)
      .execute();
    await queryRunner.manager.createQueryBuilder().delete().from(Domain)
      .execute;
  }
}
