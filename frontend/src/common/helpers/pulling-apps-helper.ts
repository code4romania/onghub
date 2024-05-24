import { CivicCenterService } from '../../services/civic-center-service/interfaces/civic-center-service.interface';
import { PracticeProgram } from '../../services/practice-program/interfaces/practice-program.interface';
import i18n from '../config/i18n';
import { formatDateMonthYear } from './format.helper';

const translations = {
  starting_with: i18n.t('practice_program:details.period_starting_with'),
  unlimited: i18n.t('practice_program:details.deadline_unlimited'),
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

export const dataToCsv = (items: { id: number; name: string }[]): string => {
  return items ? items.map((item) => item.name).join(', ') : '';
};

export const formatAgeCategories = (item: CivicCenterService) => {
  return item?.ageCategories
    .map((key) => i18n.t(`beneficiaries.${key}`, { ns: 'civic_center_service' }))
    .join(', ');
};
