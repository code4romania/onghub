import { ViewColumn, ViewEntity } from 'typeorm';
import { OrganizationStatus } from '../enums/organization-status.enum';

@ViewEntity('OrganizationView', {
  expression: `SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization_general".name as "name", COUNT("user".id) as "userCount", "organization_general".logo as "logo", COUNT(DISTINCT("organization_financial".completion_status)) as "completionStatusCount" FROM "organization" "organization"
    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id
    LEFT JOIN "organization_financial" "organization_financial" ON "organization_financial"."organizationId" = "organization".id AND "organization_financial".completion_status = 'Not Completed'
    GROUP BY "organization".id, "organization_general".id
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
  updatedOn: Date;

  @ViewColumn()
  name: string;

  @ViewColumn()
  userCount: number;

  @ViewColumn()
  logo: string;

  /**
   * This is based on the organization financial completionStatus, as financial data for expenses/incomes are completeed only if the sums are equally distributed between properties and sum the total from anaf
   * To reduce complexity we check if there is at least on status not completed if so the count will be 1 otherwise (if all completed) it will be 0
   */
  @ViewColumn()
  completionStatusCount: number;
}
