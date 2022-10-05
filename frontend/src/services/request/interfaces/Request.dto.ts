import { ICreateOrganizationPayload } from '../../../pages/create-organziation/interfaces/CreateOrganization.interface';
import { IOrganizationGeneral } from '../../../pages/organization/interfaces/OrganizationGeneral.interface';

export interface CreateRequestAdminDTO {
  name: string;
  email: string;
  phone: string;
}

export interface CreateOrganizationRequestDTO {
  admin: CreateRequestAdminDTO;
  // organization: ICreateOrganizationPayload;
}

export interface ValidateCreateOrganizationRequest {
  admin: CreateRequestAdminDTO;
  organization: {
    general: IOrganizationGeneral;
  };
}
