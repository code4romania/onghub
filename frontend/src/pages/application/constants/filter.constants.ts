import i18n from '../../../common/config/i18n';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';

const translations = {
  active: i18n.t('common:active'),
  restricted: i18n.t('common:restricted'),
  any: i18n.t('common:any'),
};

export const OngApplicationStatusOptions = [
  {
    status: null,
    label: translations.any,
  },
  {
    status: OngApplicationStatus.ACTIVE,
    label: translations.active,
  },
  {
    status: OngApplicationStatus.RESTRICTED,
    label: translations.restricted,
  },
];
