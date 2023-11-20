import { ViewEntity, ViewColumn } from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';
import { ApplicationAccess } from 'src/modules/application/interfaces/application-access.interface';
import { Role } from '../enums/role.enum';

/**
 *
 *      Created to combine the user data with the available applications to the user
 *
 *      The available apps will be returned only if:
 *
 *      1. The application is of type "independent" - everyone has access to
 *      2. The user's NGO has access to the aplication (granted by SuperAdmin)
 *      3. The user itself has access to the application (granted by NGO Admin)
 *
 */

@ViewEntity('UserApplicationsView', {
  expression: `
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
            json_agg(json_build_object('id', a.id, 'name', a.name, 'type', a.type)) as "availableApps"
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
  `,
})
export class UserApplicationsView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  phone: string;

  @ViewColumn()
  status: UserStatus;

  @ViewColumn()
  role: Role;

  @ViewColumn()
  availableApps: Pick<ApplicationAccess, 'id' | 'name' | 'type'>; // e.g. [{"id" : 2, "name" : "Beats Data", "type" : "independent"}, ...]

  @ViewColumn()
  availableAppsIDs: number[]; // e.g. 26, 28, 39 (for filtering purpose, to avoid searching in JSONs)

  @ViewColumn()
  createdOn: Date;

  @ViewColumn()
  updatedOn: Date;

  @ViewColumn()
  organizationId: number;
}
