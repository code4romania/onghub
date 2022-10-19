import { MigrationInterface, QueryRunner } from 'typeorm';
import { Faculty, Skill } from 'src/shared/entities';
import { FACULTIES } from './seed/faculties.seed';
import { SKILLS } from './seed/skills.seed';

export class FacultiesSkillsSeed1657631001020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
  }
}
