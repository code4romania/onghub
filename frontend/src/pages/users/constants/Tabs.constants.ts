import { IPageTab } from '../../../common/interfaces/tabs.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  users: i18n.t('user:tabs.users'),
  invites: i18n.t('user:tabs.invites'),
};

export const USERS_TABS: IPageTab[] = [
  { id: 0, name: translations.users, href: '' },
  { id: 1, name: translations.invites, href: 'invites' },
];
