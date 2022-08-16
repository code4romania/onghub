import { IOganizationFull } from '../../organization/interfaces/Organization.interface';
import { RequestStatus } from '../enum/RequestStatus.enum';

export interface IRequest {
  status: RequestStatus;
  name: string;
  phone: string;
  email: string;
  organization: IOganizationFull;
  createdOn: string;
}
