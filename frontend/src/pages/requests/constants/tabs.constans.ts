import { IPageTab } from '../../../common/interfaces/tabs.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  general: i18n.t('organization:tabs.general'),
  activity: i18n.t('organization:tabs.activity'),
  legal: i18n.t('organization:tabs.legal'),
};

export const ORGANIZATION_REQUEST_TABS: IPageTab[] = [
  { id: 0, name: translations.general, href: 'general' },
  { id: 1, name: translations.activity, href: 'activity' },
  { id: 2, name: translations.legal, href: 'legal' },
];
