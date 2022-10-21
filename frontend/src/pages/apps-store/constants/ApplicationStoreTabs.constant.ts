import { IPageTab } from '../../../common/interfaces/tabs.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  overview: i18n.t('appstore:tabs.overview'),
  requests: i18n.t('appstore:tabs.requests'),
};

export const APPLICATION_STORE_TABS: IPageTab[] = [
  { id: 0, name: translations.overview, href: 'overview' },
  { id: 1, name: translations.requests, href: 'requests' },
];
