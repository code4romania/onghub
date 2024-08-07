import { NAME_REGEX, EMAIL_REGEX } from '../../../../../common/helpers/format.helper';
import i18n from '../../../../../common/config/i18n';
import { isValidPhoneNumber } from 'react-phone-number-input';

const translations = {
  name: {
    required: i18n.t('legal:director_config.name.required'),
    maxim: i18n.t('legal:director_config.name.maxim'),
    minim: i18n.t('legal:director_config.name.minim'),
    invalid: i18n.t('legal:director_config.name.invalid'),
    name: i18n.t('legal:director_config.name.label'),
  },
  email: {
    required: i18n.t('legal:director_config.email.required'),
    maxim: i18n.t('legal:director_config.email.maxim'),
    invalid: i18n.t('legal:director_config.email.invalid'),
    email: i18n.t('legal:director_config.email.label'),
  },
  phone: {
    required: i18n.t('legal:director_config.phone.required'),
    maxim: i18n.t('legal:director_config.phone.maxim'),
    minim: i18n.t('legal:director_config.phone.minim'),
    invalid: i18n.t('legal:director_config.phone.invalid'),
    phone: i18n.t('legal:director_config.phone.label'),
  },
  role: {
    maxim: i18n.t('legal:director_config.role.maxim'),
    role: i18n.t('legal:director_config.role.label'),
  },
};

export const DirectorConfig: Record<string, any> = {
  fullName: {
    key: 'fullName',
    rules: {
      required: {
        value: true,
        message: translations.name.required,
      },
      maxLength: {
        value: 100,
        message: translations.name.maxim,
      },
      minLength: {
        value: 5,
        message: translations.name.minim,
      },
      pattern: {
        value: NAME_REGEX,
        message: translations.name.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.name.name,
      helperText: '',
      placeholder: 'John Doe',
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
        message: translations.email.maxim,
      },
      pattern: {
        value: EMAIL_REGEX,
        message: translations.email.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.email.email,
      helperText: '',
      placeholder: 'example@email.com',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      maxLength: {
        value: 15,
        message: translations.phone.maxim,
      },
      minLength: {
        value: 10,
        message: translations.phone.minim,
      },
      validate: (value: string) => {
        return value ? isValidPhoneNumber(value || '') || translations.phone.invalid : null;
      },
    },
    config: {
      type: 'tel',
      label: translations.phone.phone,
      helperText: '',
      placeholder: '0721111111',
    },
  },
  role: {
    key: 'role',
    rules: {
      maxLength: {
        value: 50,
        message: translations.phone.maxim,
      },
    },
    config: {
      type: 'text',
      label: i18n.t('legal:director_config.role.label'),
      helperText: '',
      placeholder: 'Administrator',
    },
  },
};
