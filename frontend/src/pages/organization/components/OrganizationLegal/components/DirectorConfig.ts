import { NAME_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../../../../../common/helpers/format.helper';
import i18n from '../../../../../common/config/i18n';

const translations = {
  name: {
    required: i18n.t('legal:director_config.name_required'),
    maxim: i18n.t('legal:director_config.name_maxim'),
    minim: i18n.t('legal:director_config.name_minim'),
    invalid: i18n.t('legal:director_config.name_invalid'),
    name: i18n.t('legal:director_config.name'),
  },
  email: {
    required: i18n.t('legal:director_config.email_required'),
    maxim: i18n.t('legal:director_config.email_maxim'),
    invalid: i18n.t('legal:director_config.email_invalid'),
    email: i18n.t('legal:director_config.email'),
  },
  phone: {
    required: i18n.t('legal:director_config.phone_required'),
    maxim: i18n.t('legal:director_config.phone_maxim'),
    minim: i18n.t('legal:director_config.phone_minim'),
    invalid: i18n.t('legal:director_config.phone_invalid'),
    phone: i18n.t('legal:director_config.phone'),
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
      required: {
        value: true,
        message: translations.phone.required,
      },
      maxLength: {
        value: 15,
        message: translations.phone.maxim,
      },
      minLength: {
        value: 10,
        message: translations.phone.minim,
      },
      pattern: {
        value: PHONE_REGEX,
        message: translations.phone.invalid,
      },
    },
    config: {
      type: 'tel',
      label: translations.phone.phone,
      helperText: '',
      placeholder: '0721111111',
    },
  },
};
