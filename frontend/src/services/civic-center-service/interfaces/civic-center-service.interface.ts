import { AgeCategory } from '../../../common/enums/age-category.enum';
import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { City } from '../../../common/interfaces/city.interface';
import { Domain } from '../../../common/interfaces/domain.interface';

export interface CivicCenterService extends BaseEntity {
  name: string;
  locationId: number;
  location: City;
  startDate: Date;
  endDate?: Date;
  shortDescription: string;
  longDescription: string;
  domains: Domain[];
  age_categories: AgeCategory[];
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
