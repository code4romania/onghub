import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { OrganizationStatus } from '../enums/OrganizationStatus.enum';

export interface IOrganization extends BaseEntity {
  status: OrganizationStatus;
  syncedOn: Date;
}
