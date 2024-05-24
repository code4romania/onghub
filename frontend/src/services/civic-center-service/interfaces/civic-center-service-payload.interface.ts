import { Beneficiary } from '../../../common/enums/age-category.enum';
import { ISelectData } from '../../../common/helpers/format.helper';
import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { City } from '../../../common/interfaces/city.interface';

export interface CivicCenterServicePayload extends BaseEntity {
  name: string;
  locationId: number;
  location: City | ISelectData;
  startDate: Date;
  endDate?: Date;
  shortDescription: string;
  longDescription: string;
  domains: number[];
  beneficiaries: Beneficiary[];
  isPeriodNotDetermined: boolean;
  hasOnlineAccess: boolean;
  onlineAccessLink?: string | null;
  onlineAccessDescription?: string | null;
  hasEmailPhoneAccess: boolean;
  emailAccess?: string | null;
  phoneAccess?: string | null;
  emailPhoneAccessDescription?: string | null;
  hasPhysicalAccess: boolean;
  physicalAccessAddress?: string | null;
  physicalAccessDescription?: string | null;
  active: boolean;
  organizationId?: string;
}
