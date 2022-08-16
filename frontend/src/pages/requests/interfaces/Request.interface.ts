import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { IOrganizationFull } from '../../organization/interfaces/Organization.interface';
import { RequestStatus } from '../enum/RequestStatus.enum';

export interface IRequest extends BaseEntity {
  status: RequestStatus;
  name: string;
  phone: string;
  email: string;
  organization: IOrganizationFull;
  createdOn: string;
}
