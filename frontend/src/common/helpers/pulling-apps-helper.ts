import { CivicCenterService } from '../../services/civic-center-service/interfaces/civic-center-service.interface';
import { PracticeProgram } from '../../services/practice-program/interfaces/practice-program.interface';
import i18n from '../config/i18n';
import { AgeCategory } from '../enums/age-category.enum';
import { formatDateMonthYear } from './format.helper';

const translations = {
  starting_with: i18n.t('practice_program:details.period_starting_with'),
  unlimited: i18n.t('practice_program:details.deadline_unlimited'),
};

const AgeCategoriesMapper = {
  [AgeCategory['0_18']]: '0-18',
  [AgeCategory['18_25']]: '18-25',
  [AgeCategory['25_35']]: '25-35',
  [AgeCategory['35_60']]: '35-60',
  [AgeCategory.OVER_60]: '>60',
};

export const calculatePeriod = (item: PracticeProgram | CivicCenterService) => {
  if (!item?.endDate) {
    const startDate = formatDateMonthYear(item?.startDate);
    return `${translations.starting_with} ${startDate}`;
  } else {
    const endDate = item?.endDate ? formatDateMonthYear(item.endDate) : translations.unlimited;
    const startDate = formatDateMonthYear(item?.startDate);
    return `${startDate} - ${endDate}`;
  }
};

export const formatDomains = (item: PracticeProgram | CivicCenterService) => {
  return item?.domains.map((domain) => domain.name).join(', ');
};

export const formatFaculties = (item: PracticeProgram) => {
  return item?.faculties.map((faculty) => faculty.name).join(', ');
};

export const formatSkills = (item: PracticeProgram) => {
  return item?.skills.map((skill) => skill.name).join(', ');
};

export const formatAgeCategories = (item: CivicCenterService) => {
  return item?.ageCategories.map((ageCategory) => AgeCategoriesMapper[ageCategory]).join(', ');
};
