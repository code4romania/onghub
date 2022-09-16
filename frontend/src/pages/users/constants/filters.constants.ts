import { UserStatus } from '../enums/UserStatus.enum';
import i18n from '../../../common/config/i18n';

const translations = {
  active: i18n.t('user:filters.active'),
  pending: i18n.t('user:filters.pending'),
  restricted: i18n.t('user:filters.restricted'),
};

export const UserStatusOptions = [
  {
    status: UserStatus.ACTIVE,
    label: translations.active,
  },
  {
    status: UserStatus.PENDING,
    label: translations.pending,
  },
  {
    status: UserStatus.RESTRICTED,
    label: translations.restricted,
  },
];
