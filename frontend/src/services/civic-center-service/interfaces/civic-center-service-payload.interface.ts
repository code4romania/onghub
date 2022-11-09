import { AgeCategory } from '../../../common/enums/age-category.enum';
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
  age_categories: AgeCategory[];
  isPeriodNotDetermined: boolean;
  hasOnlineAccess: boolean;
  onlineAccessLink?: string;
  onlineAccessDescription?: string;
  hasEmailPhoneAccess: boolean;
  emailAccess?: string;
  phoneAccess?: string;
  emailPhoneAccessDescription?: string;
  hasPhysicalAccess: boolean;
  physicalAccessAddress?: string;
  physicalAccessDescription?: string;
  active: boolean;
  organizationId: number;
}
