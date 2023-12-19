import { IOrganizationGeneral } from '../../../pages/organization/interfaces/OrganizationGeneral.interface';

export interface CreateRequestAdminDTO {
  name: string;
  email: string;
  phone: string;
}

export interface ValidateCreateOrganizationRequest {
  admin: CreateRequestAdminDTO;
  organization: {
    general: IOrganizationGeneral;
  };
}
