import { IOrganizationActivity } from '../../organization/interfaces/OrganizationActivity.interface';
import { IOrganizationGeneral } from '../../organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../../organization/interfaces/OrganizationLegal.interface';

interface ICreateOrganizationUser {
  name: string;
  phone: string;
  email: string;
  organizationId?: number;
}

export interface ICreateOrganizationPayload {
  user: ICreateOrganizationUser | null;
  general: IOrganizationGeneral | null;
  activity: IOrganizationActivity | null;
  legal: IOrganizationLegal | null;
}
