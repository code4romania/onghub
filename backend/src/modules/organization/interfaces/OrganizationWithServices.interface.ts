import { CivicCenterService } from 'src/modules/civic-center-service/entities/civic-center-service.entity';
import { Domain } from 'src/shared/entities';
import { ContactPerson } from './contact-person.interface';

export interface OrganizationWithServices {
  id: number;
  name: string;
  description: string;
  logo: string;
  domains: Domain[];
  contact: ContactPerson;
  city: string;
  county: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  services?: CivicCenterService[];
}
