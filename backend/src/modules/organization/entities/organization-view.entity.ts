import { ViewColumn, ViewEntity } from 'typeorm';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationStatus } from '../enums/organization-status.enum';

@ViewEntity('OrganizationView', {
  expression: `
    SELECT
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
      "organization_general".email AS "adminEmail",
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
  `,
})
export class OrganizationView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  status: OrganizationStatus;

  @ViewColumn()
  createdOn: Date;

  @ViewColumn()
  updatedOn: Date | null;

  @ViewColumn()
  name: string;

  @ViewColumn()
  alias: string;

  @ViewColumn()
  userCount: number;

  @ViewColumn()
  logo: string;

  @ViewColumn()
  completionStatus: CompletionStatus;

  @ViewColumn()
  adminEmail: string;
}
