import { ApplicationType } from 'aws-sdk/clients/appflow';
import { ViewEntity, ViewColumn } from 'typeorm';
import { ApplicationStatus } from '../enums/application-status.enum';

@ViewEntity('ApplicationView', {
  expression: `SELECT "application".id as "id",
  "application".logo as "logo", 
  "application".name as "name",
  "application".type as "type", 
  "application".status as "status",
  COUNT(DISTINCT("ong_application".organization_id)) as "organizationCount",
  COUNT(DISTINCT("user_ong_application".user_id)) as "userCount"
  FROM "application" 
  LEFT JOIN "ong_application" "ong_application" ON "ong_application".application_id = "application".id
  LEFT JOIN "user_ong_application" "user_ong_application" ON "user_ong_application".ong_application_id = "ong_application".id
  GROUP BY "application".id
  `,
})
export class ApplicationView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  logo: string;

  @ViewColumn()
  organizationCount: number;

  @ViewColumn()
  userCount: number;

  @ViewColumn()
  type: ApplicationType;

  @ViewColumn()
  status: ApplicationStatus;
}
