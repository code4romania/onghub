import { IPageTab } from '../../../common/interfaces/tabs.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  description: i18n.t('app:tabs.description'),
  list: i18n.t('app:tabs.list'),
};

export const APPLICATION_TABS: IPageTab[] = [
  { id: 0, name: translations.description, href: '' },
  { id: 1, name: translations.list, href: 'installs' },
];
