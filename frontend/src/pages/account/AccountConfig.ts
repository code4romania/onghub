import { PASSWORD_REGEX } from '../../common/helpers/format.helper';
import i18n from '../../common/config/i18n';

const translations = {
  old: {
    required: i18n.t('account:config.old.required'),
    invalid: i18n.t('account:config.old.invalid'),
    label: i18n.t('account:config.old.label'),
  },
  new: {
    required: i18n.t('account:config.new.required'),
    invalid: i18n.t('account:config.new.invalid'),
    label: i18n.t('account:config.new.label'),
  },
  match: i18n.t('account:config.match'),
};

export const AccountConfig: Record<string, any> = {
  oldPassword: {
    key: 'oldPassword',
    rules: {
      required: {
        value: true,
        message: translations.old.required,
      },
      pattern: {
        value: PASSWORD_REGEX,
        message: translations.old.invalid,
      },
    },
    config: {
      type: 'password',
      label: translations.old.label,
      helperText: '',
      placeholder: '',
    },
  },
  newPassword: {
    key: 'newPassword',
    rules: {
      required: {
        value: true,
        message: translations.new.required,
      },
      pattern: {
        value: PASSWORD_REGEX,
        message: translations.new.invalid,
      },
    },
    config: {
      type: 'password',
      label: translations.new.label,
      helperText: '',
      placeholder: '',
    },
  },
  matchPassword: {
    key: 'matchPassword',
    rules: {
      required: {
        value: true,
        message: translations.new.required,
      },
      pattern: {
        value: PASSWORD_REGEX,
        message: translations.new.invalid,
      },
    },
    config: {
      type: 'password',
      label: translations.match,
      helperText: '',
      placeholder: '',
    },
  },
};
