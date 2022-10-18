import { LessThanOrEqual, MoreThan } from 'typeorm';
import { WorkingHours } from '../enums/working-hours.enum';

export const WorkingHoursParser = {
  [WorkingHours['0_30']]: {
    minWorkingHours: LessThanOrEqual(30),
    maxWorkingHours: MoreThan(0),
  },
  [WorkingHours['30_50']]: {
    minWorkingHours: LessThanOrEqual(50),
    maxWorkingHours: MoreThan(30),
  },
  [WorkingHours['50_100']]: {
    minWorkingHours: LessThanOrEqual(100),
    maxWorkingHours: MoreThan(50),
  },
  [WorkingHours.OVER_100]: {
    maxWorkingHours: MoreThan(100),
  },
};
