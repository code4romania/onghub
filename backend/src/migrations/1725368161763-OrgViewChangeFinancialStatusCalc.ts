import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgViewChangeFinancialStatusCalc1725368161763
  implements MigrationInterface
{
  name = 'OrgViewChangeFinancialStatusCalc1725368161763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'OrganizationView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "OrganizationView"`);
    await queryRunner.query(`CREATE VIEW "OrganizationView" AS 
    SELECT
      "organization".id AS "id",
      "organization".status AS "status",
      "organization".created_on AS "createdOn",
    	CASE 
        WHEN COUNT(DISTINCT CASE WHEN "organization_financial".status NOT IN ('Completed', 'Pending') AND "organization_financial".status IS NOT NULL THEN 1 END) > 0
          OR COUNT(DISTINCT CASE WHEN "report".status != 'Completed' AND "report".status IS NOT NULL THEN 1 END) > 0
          OR COUNT(DISTINCT CASE WHEN "partner".status != 'Completed' AND "partner".status IS NOT NULL THEN 1 END) > 0
          OR COUNT(DISTINCT CASE WHEN "investor".status != 'Completed' AND "investor".status IS NOT NULL THEN 1 END) > 0
        THEN 'Not Completed'
        ELSE 'Completed'
    	END AS "completionStatus",
      "organization_general".name AS "name",
      "organization_general".alias AS "alias",
      "organization_general".contact_person->>'email' AS "adminEmail",
      COUNT(DISTINCT "user".id) AS "userCount",
      "organization_general".logo AS "logo",
      CASE
        WHEN MAX(GREATEST(COALESCE("organization_financial".updated_on, '1970-01-01'), COALESCE("report".updated_on, '1970-01-01'), COALESCE("partner".updated_on, '1970-01-01'), COALESCE("investor".updated_on, '1970-01-01'))) = '1970-01-01'
        THEN NULL
        ELSE MAX(GREATEST(COALESCE("organization_financial".updated_on, '1970-01-01'), COALESCE("report".updated_on, '1970-01-01'), COALESCE("partner".updated_on, '1970-01-01'), COALESCE("investor".updated_on, '1970-01-01')))::text
      END AS "updatedOn"
  FROM
      "organization" "organization"
      LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
      LEFT JOIN "user" "user" ON "user".organization_id = "organization".id
        AND "user".deleted_on IS NULL
        AND "user".ROLE = 'employee'
        AND "user".status != 'pending'
      LEFT JOIN "organization_financial" "organization_financial" ON "organization".id = "organization_financial"."organizationId"
      LEFT JOIN "organization_report" "organization_report" ON "organization".organization_report_id = "organization_report".id
      LEFT JOIN "report" "report" ON "organization_report".id = "report"."organizationReportId"
      LEFT JOIN "partner" "partner" ON "organization_report".id = "partner"."organizationReportId"
      LEFT JOIN "investor" "investor" ON "organization_report".id = "investor"."organizationReportId"
  WHERE
    "organization".status != 'pending'
  GROUP BY
    "organization".id,
    "organization_general".id
  `);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'OrganizationView',
        'SELECT\n      "organization".id AS "id",\n      "organization".status AS "status",\n      "organization".created_on AS "createdOn",\n    \tCASE \n        WHEN COUNT(DISTINCT CASE WHEN "organization_financial".status NOT IN (\'Completed\', \'Pending\') AND "organization_financial".status IS NOT NULL THEN 1 END) > 0\n          OR COUNT(DISTINCT CASE WHEN "report".status != \'Completed\' AND "report".status IS NOT NULL THEN 1 END) > 0\n          OR COUNT(DISTINCT CASE WHEN "partner".status != \'Completed\' AND "partner".status IS NOT NULL THEN 1 END) > 0\n          OR COUNT(DISTINCT CASE WHEN "investor".status != \'Completed\' AND "investor".status IS NOT NULL THEN 1 END) > 0\n        THEN \'Not Completed\'\n        ELSE \'Completed\'\n    \tEND AS "completionStatus",\n      "organization_general".name AS "name",\n      "organization_general".alias AS "alias",\n      "organization_general".contact_person->>\'email\' AS "adminEmail",\n      COUNT(DISTINCT "user".id) AS "userCount",\n      "organization_general".logo AS "logo",\n      CASE\n        WHEN MAX(GREATEST(COALESCE("organization_financial".updated_on, \'1970-01-01\'), COALESCE("report".updated_on, \'1970-01-01\'), COALESCE("partner".updated_on, \'1970-01-01\'), COALESCE("investor".updated_on, \'1970-01-01\'))) = \'1970-01-01\'\n        THEN NULL\n        ELSE MAX(GREATEST(COALESCE("organization_financial".updated_on, \'1970-01-01\'), COALESCE("report".updated_on, \'1970-01-01\'), COALESCE("partner".updated_on, \'1970-01-01\'), COALESCE("investor".updated_on, \'1970-01-01\')))::text\n      END AS "updatedOn"\n  FROM\n      "organization" "organization"\n      LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id\n      LEFT JOIN "user" "user" ON "user".organization_id = "organization".id\n        AND "user".deleted_on IS NULL\n        AND "user".ROLE = \'employee\'\n        AND "user".status != \'pending\'\n      LEFT JOIN "organization_financial" "organization_financial" ON "organization".id = "organization_financial"."organizationId"\n      LEFT JOIN "organization_report" "organization_report" ON "organization".organization_report_id = "organization_report".id\n      LEFT JOIN "report" "report" ON "organization_report".id = "report"."organizationReportId"\n      LEFT JOIN "partner" "partner" ON "organization_report".id = "partner"."organizationReportId"\n      LEFT JOIN "investor" "investor" ON "organization_report".id = "investor"."organizationReportId"\n  WHERE\n    "organization".status != \'pending\'\n  GROUP BY\n    "organization".id,\n    "organization_general".id',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'OrganizationView', 'public'],
    );
    await queryRunner.query(`DROP VIEW "OrganizationView"`);
    await queryRunner.query(`CREATE VIEW "OrganizationView" AS SELECT
      "organization".id AS "id",
      "organization".status AS "status",
      "organization".created_on AS "createdOn",
    	CASE 
        WHEN COUNT(DISTINCT CASE WHEN "organization_financial".status != 'Completed' AND "organization_financial".status IS NOT NULL THEN 1 END) > 0
          OR COUNT(DISTINCT CASE WHEN "report".status != 'Completed' AND "report".status IS NOT NULL THEN 1 END) > 0
          OR COUNT(DISTINCT CASE WHEN "partner".status != 'Completed' AND "partner".status IS NOT NULL THEN 1 END) > 0
          OR COUNT(DISTINCT CASE WHEN "investor".status != 'Completed' AND "investor".status IS NOT NULL THEN 1 END) > 0
        THEN 'Not Completed'
        ELSE 'Completed'
    	END AS "completionStatus",
      "organization_general".name AS "name",
      "organization_general".alias AS "alias",
      "organization_general".contact_person->>'email' AS "adminEmail",
      COUNT(DISTINCT "user".id) AS "userCount",
      "organization_general".logo AS "logo",
      CASE
        WHEN MAX(GREATEST(COALESCE("organization_financial".updated_on, '1970-01-01'), COALESCE("report".updated_on, '1970-01-01'), COALESCE("partner".updated_on, '1970-01-01'), COALESCE("investor".updated_on, '1970-01-01'))) = '1970-01-01'
        THEN NULL
        ELSE MAX(GREATEST(COALESCE("organization_financial".updated_on, '1970-01-01'), COALESCE("report".updated_on, '1970-01-01'), COALESCE("partner".updated_on, '1970-01-01'), COALESCE("investor".updated_on, '1970-01-01')))::text
      END AS "updatedOn"
  FROM
      "organization" "organization"
      LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
      LEFT JOIN "user" "user" ON "user".organization_id = "organization".id
        AND "user".deleted_on IS NULL
        AND "user".ROLE = 'employee'
        AND "user".status != 'pending'
      LEFT JOIN "organization_financial" "organization_financial" ON "organization".id = "organization_financial"."organizationId"
      LEFT JOIN "organization_report" "organization_report" ON "organization".organization_report_id = "organization_report".id
      LEFT JOIN "report" "report" ON "organization_report".id = "report"."organizationReportId"
      LEFT JOIN "partner" "partner" ON "organization_report".id = "partner"."organizationReportId"
      LEFT JOIN "investor" "investor" ON "organization_report".id = "investor"."organizationReportId"
  WHERE
    "organization".status != 'pending'
  GROUP BY
    "organization".id,
    "organization_general".id`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'OrganizationView',
        'SELECT\n      "organization".id AS "id",\n      "organization".status AS "status",\n      "organization".created_on AS "createdOn",\n    \tCASE \n        WHEN COUNT(DISTINCT CASE WHEN "organization_financial".status != \'Completed\' AND "organization_financial".status IS NOT NULL THEN 1 END) > 0\n          OR COUNT(DISTINCT CASE WHEN "report".status != \'Completed\' AND "report".status IS NOT NULL THEN 1 END) > 0\n          OR COUNT(DISTINCT CASE WHEN "partner".status != \'Completed\' AND "partner".status IS NOT NULL THEN 1 END) > 0\n          OR COUNT(DISTINCT CASE WHEN "investor".status != \'Completed\' AND "investor".status IS NOT NULL THEN 1 END) > 0\n        THEN \'Not Completed\'\n        ELSE \'Completed\'\n    \tEND AS "completionStatus",\n      "organization_general".name AS "name",\n      "organization_general".alias AS "alias",\n      "organization_general".contact_person->>\'email\' AS "adminEmail",\n      COUNT(DISTINCT "user".id) AS "userCount",\n      "organization_general".logo AS "logo",\n      CASE\n        WHEN MAX(GREATEST(COALESCE("organization_financial".updated_on, \'1970-01-01\'), COALESCE("report".updated_on, \'1970-01-01\'), COALESCE("partner".updated_on, \'1970-01-01\'), COALESCE("investor".updated_on, \'1970-01-01\'))) = \'1970-01-01\'\n        THEN NULL\n        ELSE MAX(GREATEST(COALESCE("organization_financial".updated_on, \'1970-01-01\'), COALESCE("report".updated_on, \'1970-01-01\'), COALESCE("partner".updated_on, \'1970-01-01\'), COALESCE("investor".updated_on, \'1970-01-01\')))::text\n      END AS "updatedOn"\n  FROM\n      "organization" "organization"\n      LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id\n      LEFT JOIN "user" "user" ON "user".organization_id = "organization".id\n        AND "user".deleted_on IS NULL\n        AND "user".ROLE = \'employee\'\n        AND "user".status != \'pending\'\n      LEFT JOIN "organization_financial" "organization_financial" ON "organization".id = "organization_financial"."organizationId"\n      LEFT JOIN "organization_report" "organization_report" ON "organization".organization_report_id = "organization_report".id\n      LEFT JOIN "report" "report" ON "organization_report".id = "report"."organizationReportId"\n      LEFT JOIN "partner" "partner" ON "organization_report".id = "partner"."organizationReportId"\n      LEFT JOIN "investor" "investor" ON "organization_report".id = "investor"."organizationReportId"\n  WHERE\n    "organization".status != \'pending\'\n  GROUP BY\n    "organization".id,\n    "organization_general".id',
      ],
    );
  }
}
