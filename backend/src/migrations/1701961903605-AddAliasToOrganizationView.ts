import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAliasToOrganizationView1701961903605
  implements MigrationInterface
{
  name = 'AddAliasToOrganizationView1701961903605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'OrganizationView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "OrganizationView"`);
    await queryRunner.query(`CREATE VIEW "OrganizationView" AS SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization".completion_status as "completionStatus", "organization_general".name as "name","organization_general".alias as "alias", COUNT("user".id) as "userCount", "organization_general".logo as "logo" FROM "organization" "organization"
    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id AND "user".deleted_on IS NULL AND "user".role = 'employee' and "user".status != 'pending'
    WHERE "organization".status != 'pending'
    GROUP BY "organization".id, "organization_general".id
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'OrganizationView',
        'SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization".completion_status as "completionStatus", "organization_general".name as "name","organization_general".alias as "alias", COUNT("user".id) as "userCount", "organization_general".logo as "logo" FROM "organization" "organization"\n    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id\n    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id AND "user".deleted_on IS NULL AND "user".role = \'employee\' and "user".status != \'pending\'\n    WHERE "organization".status != \'pending\'\n    GROUP BY "organization".id, "organization_general".id',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'OrganizationView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "OrganizationView"`);
    await queryRunner.query(`CREATE VIEW "OrganizationView" AS SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization".completion_status as "completionStatus", "organization_general".name as "name", COUNT("user".id) as "userCount", "organization_general".logo as "logo" FROM "organization" "organization"
    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id AND "user".deleted_on IS NULL AND "user".role = 'employee' and "user".status != 'pending'
    WHERE "organization".status != 'pending'
    GROUP BY "organization".id, "organization_general".id`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'OrganizationView',
        'SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization".completion_status as "completionStatus", "organization_general".name as "name", COUNT("user".id) as "userCount", "organization_general".logo as "logo" FROM "organization" "organization"\n    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id\n    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id AND "user".deleted_on IS NULL AND "user".role = \'employee\' and "user".status != \'pending\'\n    WHERE "organization".status != \'pending\'\n    GROUP BY "organization".id, "organization_general".id',
      ],
    );
  }
}
