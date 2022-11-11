import { CivicCenterService } from 'src/modules/civic-center-service/entities/civic-center-service.entity';
import { Domain } from 'src/shared/entities';
import { Contact } from '../entities';

export interface OrganizationWithServices {
  id: number;
  name: string;
  description: string;
  logo: string;
  domains: Domain[];
  contact: Contact;
  city: string;
  county: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  services?: CivicCenterService[];
}
