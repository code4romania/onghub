import { NAME_REGEX, EMAIL_REGEX } from '../../../../common/helpers/format.helper';
import i18n from '../../../../common/config/i18n';
import { isValidPhoneNumber } from 'react-phone-number-input';

const translations = {
  name: {
    required: i18n.t('user:config.name.required'),
    max: i18n.t('user:config.name.max'),
    min: i18n.t('user:config.name.min'),
    invalid: i18n.t('user:config.name.invalid'),
    label: i18n.t('user:config.name.label'),
  },
  email: {
    required: i18n.t('user:config.email.required'),
    max: i18n.t('user:config.email.max'),
    invalid: i18n.t('user:config.email.invalid'),
    label: i18n.t('user:config.email.label'),
  },
  phone: {
    required: i18n.t('user:config.phone.required'),
    max: i18n.t('user:config.phone.max'),
    min: i18n.t('user:config.phone.min'),
    invalid: i18n.t('user:config.phone.invalid'),
    label: i18n.t('user:config.phone.label'),
  },
};

export const UserCreateConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: translations.name.required,
      },
      maxLength: {
        value: 100,
        message: translations.name.max,
      },
      minLength: {
        value: 5,
        message: translations.name.min,
      },
      pattern: {
        value: NAME_REGEX,
        message: translations.name.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.name.label,
      helperText: '',
      placeholder: '',
    },
  },
  email: {
    key: 'email',
    rules: {
      required: {
        value: true,
        message: translations.email.required,
      },
      maxLength: {
        value: 50,
        message: translations.email.max,
      },
      pattern: {
        value: EMAIL_REGEX,
        message: translations.email.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.email.label,
      helperText: '',
      placeholder: '',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      maxLength: {
        value: 15,
        message: translations.phone.max,
      },
      minLength: {
        value: 10,
        message: translations.phone.min,
      },
      validate: (value: string) => {
        if (!value) {
          return true;
        }
        return isValidPhoneNumber(value) || translations.phone.invalid;
      },
    },
    config: {
      type: 'tel',
      label: translations.phone.label,
      helperText: '',
      placeholder: '',
    },
  },
};
