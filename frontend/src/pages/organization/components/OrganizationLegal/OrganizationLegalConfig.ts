import { NAME_REGEX, EMAIL_REGEX } from '../../../../common/helpers/format.helper';
import i18n from '../../../../common/config/i18n';
import { isValidPhoneNumber } from 'react-phone-number-input';

const translations = {
  name: {
    required: i18n.t('legal:legal_config.name.required'),
    maxim: i18n.t('legal:legal_config.name.maxim'),
    minim: i18n.t('legal:legal_config.name.minim'),
    invalid: i18n.t('legal:legal_config.name.invalid'),
    name: i18n.t('legal:legal_config.name.label'),
  },
  email: {
    required: i18n.t('legal:legal_config.email.required'),
    maxim: i18n.t('legal:legal_config.email.maxim'),
    invalid: i18n.t('legal:legal_config.email.invalid'),
    email: i18n.t('legal:legal_config.email.label'),
  },
  phone: {
    required: i18n.t('legal:legal_config.phone.required'),
    maxim: i18n.t('legal:legal_config.phone.required'),
    minim: i18n.t('legal:legal_config.phone.minim'),
    invalid: i18n.t('legal:legal_config.phone.invalid'),
    phone: i18n.t('legal:legal_config.phone.label'),
  },
};

export const OrganizationLegalConfig: Record<string, any> = {
  legal_reprezentative_name: {
    key: 'legalReprezentative_fullName',
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
      placeholder: '',
    },
  },
  legal_reprezentative_email: {
    key: 'legalReprezentative_email',
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
      placeholder: '',
    },
  },
  legal_reprezentative_phone: {
    key: 'legalReprezentative_phone',
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
        return isValidPhoneNumber(value) || translations.phone.invalid;
      },
    },
    config: {
      type: 'tel',
      label: translations.phone.phone,
      helperText: '',
      placeholder: '',
    },
  },
};
