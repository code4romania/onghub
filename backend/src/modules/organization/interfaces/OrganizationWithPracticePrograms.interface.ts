import { PracticeProgram } from 'src/modules/practice-program/entities/practice-program.entity';
import { Domain } from 'src/shared/entities';
import { Contact } from '../entities';

export interface OrganizationWithPracticePrograms {
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
  practicePrograms?: PracticeProgram[];
}
