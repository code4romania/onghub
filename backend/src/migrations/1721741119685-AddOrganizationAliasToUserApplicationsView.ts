import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationAliasToUserApplicationsView1721741119685
  implements MigrationInterface
{
  name = 'AddOrganizationAliasToUserApplicationsView1721741119685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'UserApplicationsView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "UserApplicationsView"`);
    await queryRunner.query(`CREATE VIEW "UserApplicationsView" AS 
      SELECT u.id,
          u.name,
          u.email,
          u.phone,
          u.status,
          u.role,
          u.organization_id AS "organizationId",
          u.created_on AS "createdOn",
          u.updated_on AS "updatedOn",
          og.alias as "organizationAlias",
          array_agg(DISTINCT a.id) AS "availableAppsIDs",
          json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type)) AS "availableApps"
        FROM "user" u
          LEFT JOIN user_ong_application uoa ON u.id = uoa.user_id AND uoa.status = 'active'::user_ong_application_status_enum
          LEFT JOIN ong_application oa ON uoa.ong_application_id = oa.id AND oa.status = 'active'::ong_application_status_enum
          LEFT JOIN application a ON (oa.application_id = a.id OR a.type = 'independent'::application_type_enum) AND a.status = 'active'::application_status_enum
          LEFT JOIN organization o ON u.organization_id = o.id
          LEFT JOIN organization_general og ON o.organization_general_id = og.id
      WHERE u.role = 'employee'::user_role_enum AND (u.status = ANY (ARRAY['active'::user_status_enum, 'restricted'::user_status_enum])) AND u.deleted_on IS NULL
      GROUP BY u.id, og.alias;

  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'UserApplicationsView',
        "SELECT u.id,\n          u.name,\n          u.email,\n          u.phone,\n          u.status,\n          u.role,\n          u.organization_id AS \"organizationId\",\n          u.created_on AS \"createdOn\",\n          u.updated_on AS \"updatedOn\",\n          og.alias as \"organizationAlias\",\n          array_agg(DISTINCT a.id) AS \"availableAppsIDs\",\n          json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type)) AS \"availableApps\"\n        FROM \"user\" u\n          LEFT JOIN user_ong_application uoa ON u.id = uoa.user_id AND uoa.status = 'active'::user_ong_application_status_enum\n          LEFT JOIN ong_application oa ON uoa.ong_application_id = oa.id AND oa.status = 'active'::ong_application_status_enum\n          LEFT JOIN application a ON (oa.application_id = a.id OR a.type = 'independent'::application_type_enum) AND a.status = 'active'::application_status_enum\n          LEFT JOIN organization o ON u.organization_id = o.id\n          LEFT JOIN organization_general og ON o.organization_general_id = og.id\n      WHERE u.role = 'employee'::user_role_enum AND (u.status = ANY (ARRAY['active'::user_status_enum, 'restricted'::user_status_enum])) AND u.deleted_on IS NULL\n      GROUP BY u.id, og.alias;",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'UserApplicationsView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "UserApplicationsView"`);
    await queryRunner.query(`CREATE VIEW "UserApplicationsView" AS SELECT u.id,
          u.name,
          u.email,
          u.phone,
          u.status,
          u.role,
          u.organization_id AS "organizationId",
          u.created_on AS "createdOn",
          u.updated_on AS "updatedOn",
          og.alias,
          array_agg(DISTINCT a.id) AS "availableAppsIDs",
          json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type)) AS "availableApps"
        FROM "user" u
          LEFT JOIN user_ong_application uoa ON u.id = uoa.user_id AND uoa.status = 'active'::user_ong_application_status_enum
          LEFT JOIN ong_application oa ON uoa.ong_application_id = oa.id AND oa.status = 'active'::ong_application_status_enum
          LEFT JOIN application a ON (oa.application_id = a.id OR a.type = 'independent'::application_type_enum) AND a.status = 'active'::application_status_enum
          LEFT JOIN organization o ON u.organization_id = o.id
          LEFT JOIN organization_general og ON o.organization_general_id = og.id
      WHERE u.role = 'employee'::user_role_enum AND (u.status = ANY (ARRAY['active'::user_status_enum, 'restricted'::user_status_enum])) AND u.deleted_on IS NULL
      GROUP BY u.id, og.alias;`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'UserApplicationsView',
        "SELECT u.id,\n          u.name,\n          u.email,\n          u.phone,\n          u.status,\n          u.role,\n          u.organization_id AS \"organizationId\",\n          u.created_on AS \"createdOn\",\n          u.updated_on AS \"updatedOn\",\n          og.alias,\n          array_agg(DISTINCT a.id) AS \"availableAppsIDs\",\n          json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'type', a.type)) AS \"availableApps\"\n        FROM \"user\" u\n          LEFT JOIN user_ong_application uoa ON u.id = uoa.user_id AND uoa.status = 'active'::user_ong_application_status_enum\n          LEFT JOIN ong_application oa ON uoa.ong_application_id = oa.id AND oa.status = 'active'::ong_application_status_enum\n          LEFT JOIN application a ON (oa.application_id = a.id OR a.type = 'independent'::application_type_enum) AND a.status = 'active'::application_status_enum\n          LEFT JOIN organization o ON u.organization_id = o.id\n          LEFT JOIN organization_general og ON o.organization_general_id = og.id\n      WHERE u.role = 'employee'::user_role_enum AND (u.status = ANY (ARRAY['active'::user_status_enum, 'restricted'::user_status_enum])) AND u.deleted_on IS NULL\n      GROUP BY u.id, og.alias;",
      ],
    );
  }
}
