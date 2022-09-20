import { UserOngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';

export interface IUserPayload {
  name: string;
  email: string;
  phone: string;
  organizationId: number;
  applicationAccess: { ongApplicationId: number; status: UserOngApplicationStatus }[];
}
