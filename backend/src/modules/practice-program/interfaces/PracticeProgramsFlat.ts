import { PracticeProgram } from '../entities/practice-program.entity';

export interface PracticeProgramFlat extends PracticeProgram {
  organizationId: number;
  organizationName: string;
  logo: string;
}
