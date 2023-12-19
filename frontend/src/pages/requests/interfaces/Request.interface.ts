import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { Application } from '../../../services/application/interfaces/Application.interface';
import { IOrganizationFull } from '../../organization/interfaces/Organization.interface';
import { RequestStatus } from '../enum/RequestStatus.enum';

export interface IOrganizationRequest extends BaseEntity {
  status: RequestStatus;
  email: string;
  phone: string;
  name: string;
  organizationName: string;
  organization: IOrganizationFull;
  logo: string;
}

export interface IApplicationRequest extends BaseEntity {
  status: RequestStatus;
  organizationId: number;
  organization: Partial<IOrganizationFull>;
  applicationId: number;
  application: Partial<Application>;
}
