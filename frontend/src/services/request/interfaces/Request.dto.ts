import { ICreateOrganizationPayload } from '../../../pages/create-organziation/interfaces/CreateOrganization.interface';

export interface CreateRequestAdminDTO {
  name: string;
  email: string;
  phone: string;
}

export interface CreateOrganizationRequestDTO {
  admin: CreateRequestAdminDTO;
  organization: ICreateOrganizationPayload;
}

export interface CreateApplicationRequestDTO {
  applicationId: number;
}
