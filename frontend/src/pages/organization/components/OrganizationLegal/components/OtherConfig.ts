import { NAME_REGEX } from '../../../../../common/helpers/format.helper';
import i18n from '../../../../../common/config/i18n';

const translations = {
  name: {
    required: i18n.t('legal:other_config.name.required'),
    maxim: i18n.t('legal:other_config.name.maxim'),
    minim: i18n.t('legal:other_config.name.minim'),
    invalid: i18n.t('legal:other_config.name.invalid'),
    label: i18n.t('legal:other_config.name.label'),
  },
  role: {
    required: i18n.t('legal:other_config.role.required'),
    maxim: i18n.t('legal:other_config.role.maxim'),
    minim: i18n.t('legal:other_config.role.minim'),
    invalid: i18n.t('legal:other_config.role.invalid'),
    label: i18n.t('legal:other_config.role.label'),
  },
};

export const OtherConfig: Record<string, any> = {
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
      label: translations.name.label,
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
      label: translations.role.label,
      helperText: '',
      placeholder: 'Rol',
    },
  },
};
