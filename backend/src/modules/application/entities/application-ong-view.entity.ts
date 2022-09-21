import { ViewEntity, ViewColumn } from 'typeorm';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';

@ViewEntity('ApplicationOngView', {
  expression: `
  SELECT "application".id as "applicationId", 
  "organization".id as "organizationId",
  "organization_general".logo as "logo", 
  "organization_general".name as "name", 
  COUNT("user_ong_application".id) as "userCount", 
  "organization".created_on as "createdOn", 
  "ong_application".status as "status"
  FROM "organization" 
  LEFT JOIN "ong_application" "ong_application" ON "ong_application".organization_id = "organization".id
  LEFT JOIN "application" "application" ON "application".id = "ong_application".application_id
  LEFT JOIN "organization_general" "organization_general" ON "organization_general".id = "organization".organization_general_id
  LEFT JOIN "user_ong_application" "user_ong_application" ON "user_ong_application".ong_application_id = "ong_application".id
  GROUP BY "organization".id, "organization_general".id, "ong_application".id, "application".id`,
})
export class ApplicationOngView {
  @ViewColumn()
  applicationId: number;

  @ViewColumn()
  organizationId: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  logo: string;

  @ViewColumn()
  userCount: number;

  @ViewColumn()
  createdOn: Date;

  @ViewColumn()
  status: OngApplicationStatus;
}
