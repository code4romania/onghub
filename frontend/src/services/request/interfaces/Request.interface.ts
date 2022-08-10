import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { IOganizationFull } from '../../../pages/organization/interfaces/Organization.interface';

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DECLINED = 'Declined',
}

export interface Request extends BaseEntity {
  status: RequestStatus;
  name: string;
  email: string;
  phone: string;
  organization: IOganizationFull;
}
