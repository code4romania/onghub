import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { User } from '../../../common/interfaces/user.interface';
import { IOrganizationFull } from '../../../pages/organization/interfaces/Organization.interface';
import { Application } from '../../application/interfaces/Application.interface';

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DECLINED = 'Declined',
}

export enum RequestType {
  CREATE_ORGANIZATION = 'create_organization',
  REQUEST_APPLICATION_ACCESS = 'request_application_access',
}

export interface Request extends BaseEntity {
  status: RequestStatus;
  type: RequestType;

  organization: IOrganizationFull;
  organizationId: number;

  application: Application;
  applicationId: number;

  userId: number;
  user: User;
}
