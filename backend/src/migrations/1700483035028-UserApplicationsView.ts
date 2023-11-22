import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserApplicationsView1700483035028 implements MigrationInterface {
  name = 'UserApplicationsView1700483035028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "UserApplicationsView" AS 
        SELECT
            u.id,
            u.name,
            u.email,
            u.phone,
            u.status,
            u.role,
            u.organization_id as "organizationId",
            u.created_on as "createdOn",
            u.updated_on as "updatedOn",
            ARRAY_AGG(DISTINCT a.id) as "availableAppsIDs",
            json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type)) as "availableApps"
        FROM
            "user" u
        LEFT JOIN user_ong_application uoa ON u.id = uoa.user_id AND uoa.status = 'active'
        LEFT JOIN ong_application oa ON uoa.ong_application_id = oa.id AND oa.status = 'active'
        LEFT JOIN application a ON (oa.application_id = a.id OR a.type = 'independent') AND a.status = 'active'
        WHERE
            "u"."role" = 'employee' AND
            "u"."status" IN('active', 'restricted') AND
            "u"."deleted_on" IS NULL
        GROUP BY
            u.id
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'UserApplicationsView',
        'SELECT\n            u.id,\n            u.name,\n            u.email,\n            u.phone,\n            u.status,\n            u.role,\n            u.organization_id as "organizationId",\n            u.created_on as "createdOn",\n            u.updated_on as "updatedOn",\n            ARRAY_AGG(DISTINCT a.id) as "availableAppsIDs",\n            json_agg(json_build_object(\'id\', a.id, \'name\', a.name, \'type\', a.type)) as "availableApps"\n        FROM\n            "user" u\n        LEFT JOIN user_ong_application uoa ON u.id = uoa.user_id AND uoa.status = \'active\'\n        LEFT JOIN ong_application oa ON uoa.ong_application_id = oa.id AND oa.status = \'active\'\n        LEFT JOIN application a ON (oa.application_id = a.id OR a.type = \'independent\') AND a.status = \'active\'\n        WHERE\n            "u"."role" = \'employee\' AND\n            "u"."status" IN(\'active\', \'restricted\') AND\n            "u"."deleted_on" IS NULL\n        GROUP BY\n            u.id',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'UserApplicationsView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "UserApplicationsView"`);
  }
}
