import i18n from '../../../common/config/i18n';

export const CREATE_USER_ERRORS: Record<string, string> = {
  USR_008: i18n.t('user:failure_email'),
  USR_013: i18n.t('user:failure_phone'),
  USR_001: i18n.t('user:create.failure'),
  USR_015: i18n.t('general:config.email.invalid'),
};
