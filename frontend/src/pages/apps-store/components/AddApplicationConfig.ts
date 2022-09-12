import { ALPHANUMERIC_REGEX, URL_REGEX } from '../../../common/helpers/format.helper';
import InputFieldHttpAddon from '../../../components/InputField/components/InputFieldHttpAddon';
import { ApplicationTypeEnum, ApplicationTypeNaming } from '../constants/ApplicationType.enum';
import i18n from '../../../common/config/i18n';

const translations = {
  name: {
    required: i18n.t('appstore:config.name.required'),
    max: i18n.t('appstore:config.name.max'),
    min: i18n.t('appstore:config.name.min'),
    invalid: i18n.t('appstore:config.name.invalid'),
    label: i18n.t('appstore:config.name.label'),
    helper: i18n.t('appstore:config.name.helper'),
  },
  type: {
    label: i18n.t('appstore:config.type.label'),
    required: i18n.t('appstore:config.type.required'),
  },
  short: {
    required: i18n.t('appstore:config.short.required'),
    max: i18n.t('appstore:config.short.max'),
    min: i18n.t('appstore:config.short.min'),
    label: i18n.t('appstore:config.short.label'),
    helper: i18n.t('appstore:config.short.helper'),
  },
  description: {
    required: i18n.t('appstore:config.description.required'),
    max: i18n.t('appstore:config.description.max'),
    min: i18n.t('appstore:config.description.min'),
    label: i18n.t('appstore:config.description.label'),
    helper: i18n.t('appstore:config.description.helper'),
  },
  website: {
    label: i18n.t('appstore:config.website.label'),
    required: i18n.t('appstore:config.website.required'),
  },
  login_link: {
    label: i18n.t('appstore:config.login_link.label'),
    required: i18n.t('appstore:config.login_link.required'),
  },
  video_link: {
    label: i18n.t('appstore:config.video_link.label'),
    helper: i18n.t('appstore:config.video_link.helper'),
    required: i18n.t('appstore:config.video_link.required'),
  },
  step: {
    required: i18n.t('appstore:config.step.required'),
    invalid: i18n.t('appstore:config.step.invalid'),
    label: i18n.t('appstore:config.step.label'),
  },
  url: i18n.t('common:url'),
};

export const AddAppConfig: Record<string, any> = {
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
        value: 3,
        message: translations.name.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.name.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.name.label,
      helperText: translations.name.helper,
      placeholder: '',
    },
  },
  type: {
    key: 'type',
    label: translations.type.label,
    rules: {
      required: {
        value: true,
        message: translations.type.required,
      },
    },
    helperText: '',
    radioConfigs: [
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.INDEPENDENT],
        name: 'type',
        value: ApplicationTypeEnum.INDEPENDENT,
      },
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.SIMPLE],
        name: 'type',
        value: ApplicationTypeEnum.SIMPLE,
      },
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.STANDALONE],
        name: 'type',
        value: ApplicationTypeEnum.STANDALONE,
      },
    ],
  },
  shortDescription: {
    key: 'shortDescription',
    rules: {
      required: {
        value: true,
        message: translations.short.required,
      },
      maxLength: {
        value: 250,
        message: translations.short.max,
      },
      minLength: {
        value: 50,
        message: translations.short.min,
      },
    },
    config: {
      type: 'text',
      label: translations.short.label,
      helperText: translations.short.helper,
      placeholder: '',
    },
  },
  description: {
    key: 'description',
    rules: {
      required: {
        value: true,
        message: translations.description.required,
      },
      maxLength: {
        value: 700,
        message: translations.description.max,
      },
      minLength: {
        value: 200,
        message: translations.description.min,
      },
    },
    config: {
      type: 'text',
      label: translations.description.label,
      helperText: translations.description.helper,
      placeholder: '',
    },
  },
  website: {
    key: 'website',
    rules: {
      required: {
        value: true,
        message: translations.website.required,
      },
      pattern: {
        value: URL_REGEX,
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: translations.website.label,
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  loginLink: {
    key: 'loginLink',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: translations.url,
      },
      required: {
        value: true,
        message: translations.login_link.required,
      },
    },
    config: {
      type: 'text',
      label: translations.login_link.label,
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  videoLink: {
    key: 'videoLink',
    rules: {
      required: {
        value: true,
        message: translations.video_link.required,
      },
      pattern: {
        value: URL_REGEX,
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: translations.video_link.label,
      helperText: translations.video_link.helper,
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  step: {
    key: 'step',
    rules: {
      required: {
        value: true,
        message: translations.step.required,
      },
    },
    config: {
      type: 'text',
      label: translations.step.label,
      helperText: '',
      placeholder: '',
    },
  },
};
