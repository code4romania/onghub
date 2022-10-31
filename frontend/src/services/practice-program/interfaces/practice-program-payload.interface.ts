import { ISelectData } from '../../../common/helpers/format.helper';
import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { City } from '../../../common/interfaces/city.interface';
import { Faculty } from '../../../common/interfaces/faculty.interface';
import { Skill } from '../../../common/interfaces/skill.interface';

export interface PracticeProgramPayload extends BaseEntity {
  title: string;
  active?: boolean;
  deadline?: Date;
  description: string;
  startDate: Date;
  endDate?: Date;
  isPeriodNotDetermined: boolean;
  minWorkingHours: number;
  maxWorkingHours?: number;
  link?: string;
  location?: City | ISelectData;
  locationId: number;
  domains: number[];
  faculties?: ISelectData[] | number[] | Faculty[];
  skills: Partial<Skill>[] | ISelectData[];
}
