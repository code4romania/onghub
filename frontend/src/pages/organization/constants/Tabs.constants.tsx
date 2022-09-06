import { IPageTab } from '../../../common/interfaces/tabs.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  general: i18n.t('organization:tabs.general'),
  activity: i18n.t('organization:tabs.activity'),
  legal: i18n.t('organization:tabs.legal'),
  financial: i18n.t('organization:tabs.financial'),
  open_data: i18n.t('organization:tabs.open_data'),
};

export const ORGANIZATION_TABS: IPageTab[] = [
  { id: 0, name: translations.general, href: 'general' },
  { id: 1, name: translations.activity, href: 'activity' },
  { id: 2, name: translations.legal, href: 'legal' },
  { id: 3, name: translations.financial, href: 'financial' },
  { id: 4, name: translations.open_data, href: 'data' },
];
