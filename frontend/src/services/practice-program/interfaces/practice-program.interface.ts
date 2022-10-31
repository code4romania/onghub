import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { City } from '../../../common/interfaces/city.interface';
import { Domain } from '../../../common/interfaces/domain.interface';
import { Faculty } from '../../../common/interfaces/faculty.interface';
import { Skill } from '../../../common/interfaces/skill.interface';

export interface PracticeProgram extends BaseEntity {
  title: string;
  active: boolean;
  deadline: Date;
  description: string;
  startDate: Date;
  endDate: Date;
  isPeriodNotDetermined: boolean;
  minWorkingHours: number;
  maxWorkingHours: number;
  link: string;
  location: City;
  domains: Domain[];
  faculties: Faculty[];
  skills: Skill[];
}
