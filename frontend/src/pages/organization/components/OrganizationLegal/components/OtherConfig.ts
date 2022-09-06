import { NAME_REGEX } from '../../../../../common/helpers/format.helper';
import i18n from '../../../../../common/config/i18n';

const translations = {
  other: {
    required: i18n.t('legal:other_config.other_required'),
    maxim: i18n.t('legal:other_config.other_maxim'),
    minim: i18n.t('legal:other_config.other_minim'),
    invalid: i18n.t('legal:other_config.other_invalid'),
    other: i18n.t('legal:other_config.other'),
  },
  role: {
    required: i18n.t('legal:other_config.role_required'),
    maxim: i18n.t('legal:other_config.role_maxim'),
    minim: i18n.t('legal:other_config.role_minim'),
    invalid: i18n.t('legal:other_config.role_invalid'),
    role: i18n.t('legal:other_config.role'),
  },
};

export const OtherConfig: Record<string, any> = {
  fullName: {
    key: 'fullName',
    rules: {
      required: {
        value: true,
        message: translations.other.required,
      },
      maxLength: {
        value: 100,
        message: translations.other.maxim,
      },
      minLength: {
        value: 5,
        message: translations.other.minim,
      },
      pattern: {
        value: NAME_REGEX,
        message: translations.other.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.other.other,
      helperText: '',
      placeholder: 'John Doe',
    },
  },
  role: {
    key: 'role',
    rules: {
      required: {
        value: true,
        message: translations.role.required,
      },
      maxLength: {
        value: 50,
        message: translations.role.maxim,
      },
      minLength: {
        value: 3,
        message: translations.role.minim,
      },
      pattern: {
        value: NAME_REGEX,
        message: translations.role.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.role.role,
      helperText: '',
      placeholder: 'Rol',
    },
  },
};
