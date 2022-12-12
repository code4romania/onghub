import { PracticeProgram } from 'src/modules/practice-program/entities/practice-program.entity';
import { Domain } from 'src/shared/entities';
import { OngContact } from '../dto/ong-contact.dto';

export interface OrganizationWithPracticePrograms {
  id: number;
  name: string;
  description: string;
  logo: string;
  domains: Domain[];
  contact: OngContact;
  city: string;
  county: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  practicePrograms?: PracticeProgram[];
}
