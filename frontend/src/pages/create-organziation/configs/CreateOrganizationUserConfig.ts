import { NAME_REGEX, EMAIL_REGEX } from '../../../common/helpers/format.helper';
import i18n from '../../../common/config/i18n';
import { isValidPhoneNumber } from 'react-phone-number-input';

const translations = {
  name: {
    required: i18n.t('organization:create_config.name.required'),
    max: i18n.t('organization:create_config.name.max'),
    min: i18n.t('organization:create_config.name.min'),
    invalid: i18n.t('organization:create_config.name.invalid'),
    label: i18n.t('organization:create_config.name.label'),
  },
  phone: {
    required: i18n.t('organization:create_config.phone.required'),
    min: i18n.t('organization:create_config.phone.min'),
    max: i18n.t('organization:create_config.phone.max'),
    invalid: i18n.t('organization:create_config.phone.invalid'),
    label: i18n.t('organization:create_config.phone.label'),
  },
  email: {
    required: i18n.t('organization:create_config.email.required'),
    max: i18n.t('organization:create_config.email.max'),
    invalid: i18n.t('organization:create_config.email.invalid'),
    label: i18n.t('organization:create_config.email.label'),
  },
};

export const CreateOrganizationUserConfig: Record<string, any> = {
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
      placeholder: 'Ana Maria Stoian',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      required: {
        value: true,
        message: translations.phone.required,
      },
      minLength: {
        value: 10,
        message: translations.phone.min,
      },
      maxLength: {
        value: 15,
        message: translations.phone.max,
      },
      validate: (value: string) => {
        return isValidPhoneNumber(value) || translations.phone.invalid;
      },
    },
    config: {
      type: 'tel',
      label: translations.phone.label,
      helperText: '',
      placeholder: '+40712345678',
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
      placeholder: 'you@example.com',
    },
  },
};
