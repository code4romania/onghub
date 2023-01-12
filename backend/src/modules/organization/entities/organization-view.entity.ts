import { ViewColumn, ViewEntity } from 'typeorm';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationStatus } from '../enums/organization-status.enum';

@ViewEntity('OrganizationView', {
  expression: `SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization".completion_status as "completionStatus", "organization_general".name as "name", COUNT("user".id) as "userCount", "organization_general".logo as "logo" FROM "organization" "organization"
    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id AND "user".deleted_on IS NULL AND "user".role = 'employee' and "user".status != 'pending'
    WHERE "organization".status != 'pending'
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

  @ViewColumn()
  completionStatus: CompletionStatus;
}
