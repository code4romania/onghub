import { ALPHANUMERIC_REGEX, EMAIL_REGEX, URL_REGEX } from '../../../common/helpers/format.helper';
import i18n from '../../../common/config/i18n';
import InputFieldHttpAddon from '../../../components/InputField/components/InputFieldHttpAddon';
import { isValidPhoneNumber } from 'react-phone-number-input';

const translations = {
  name: {
    required: i18n.t('civic_center_service:form.name.required'),
    max: i18n.t('civic_center_service:form.name.max'),
    min: i18n.t('civic_center_service:form.name.min'),
    pattern: i18n.t('civic_center_service:form.name.pattern'),
    label: i18n.t('civic_center_service:form.name.label'),
    helper: i18n.t('civic_center_service:form.name.helper'),
    placeholder: i18n.t('civic_center_service:form.name.placeholder'),
  },
  location: {
    required: i18n.t('civic_center_service:form.location.required'),
    label: i18n.t('civic_center_service:form.location.label'),
    helper: i18n.t('civic_center_service:form.location.helper'),
    placeholder: i18n.t('civic_center_service:form.location.placeholder'),
  },
  startDate: {
    required: i18n.t('civic_center_service:form.start_date.required'),
    label: i18n.t('civic_center_service:form.start_date.label'),
    helper: i18n.t('civic_center_service:form.start_date.helper'),
    placeholder: i18n.t('civic_center_service:form.start_date.placeholder'),
  },
  endDate: {
    label: i18n.t('civic_center_service:form.end_date.label'),
    helper: i18n.t('civic_center_service:form.end_date.helper'),
    placeholder: i18n.t('civic_center_service:form.end_date.placeholder'),
  },
  isPeriodNotDetermined: {
    label: i18n.t('civic_center_service:form.is_period_not_determined.label'),
    helper: i18n.t('civic_center_service:form.is_period_not_determined.helper'),
  },
  shortDescription: {
    required: i18n.t('civic_center_service:form.short_description.required'),
    max: i18n.t('civic_center_service:form.short_description.max'),
    min: i18n.t('civic_center_service:form.short_description.min'),
    pattern: i18n.t('civic_center_service:form.short_description.pattern'),
    label: i18n.t('civic_center_service:form.short_description.label'),
    helper: i18n.t('civic_center_service:form.short_description.helper'),
    placeholder: i18n.t('civic_center_service:form.short_description.placeholder'),
  },
  longDescription: {
    required: i18n.t('civic_center_service:form.long_description.required'),
    max: i18n.t('civic_center_service:form.long_description.max'),
    min: i18n.t('civic_center_service:form.long_description.min'),
    pattern: i18n.t('civic_center_service:form.long_description.pattern'),
    label: i18n.t('civic_center_service:form.long_description.label'),
    helper: i18n.t('civic_center_service:form.long_description.helper'),
    placeholder: i18n.t('civic_center_service:form.long_description.placeholder'),
  },
  domains: {
    required: i18n.t('civic_center_service:form.domains.required'),
    label: i18n.t('civic_center_service:form.domains.label'),
    helper: i18n.t('civic_center_service:form.domains.helper'),
  },
  beneficiaries: {
    label: i18n.t('civic_center_service:form.age_category.label'),
    helper: i18n.t('civic_center_service:form.age_category.helper'),
    required: i18n.t('civic_center_service:form.age_category.required'),
  },
  online: {
    toggle: {
      label: i18n.t('civic_center_service:form.online.toggle.label'),
    },
    link: {
      required: i18n.t('civic_center_service:form.online.link.required'),
      pattern: i18n.t('civic_center_service:form.online.link.pattern'),
      label: i18n.t('civic_center_service:form.online.link.label'),
      helper: i18n.t('civic_center_service:form.online.link.helper'),
      placeholder: i18n.t('civic_center_service:form.online.link.placeholder'),
    },
    description: {
      max: i18n.t('civic_center_service:form.online.description.max'),
      pattern: i18n.t('civic_center_service:form.online.description.pattern'),
      label: i18n.t('civic_center_service:form.online.description.label'),
      placeholder: i18n.t('civic_center_service:form.online.description.placeholder'),
    },
  },
  emailOrPhone: {
    toggle: {
      label: i18n.t('civic_center_service:form.email_or_phone.toggle.label'),
    },
    email: {
      required: i18n.t('civic_center_service:form.email_or_phone.email.required'),
      pattern: i18n.t('civic_center_service:form.email_or_phone.email.pattern'),
      label: i18n.t('civic_center_service:form.email_or_phone.email.label'),
      helper: i18n.t('civic_center_service:form.email_or_phone.email.helper'),
      max: i18n.t('civic_center_service:form.email_or_phone.email.max'),
    },
    phone: {
      required: i18n.t('civic_center_service:form.email_or_phone.phone.required'),
      pattern: i18n.t('civic_center_service:form.email_or_phone.phone.pattern'),
      label: i18n.t('civic_center_service:form.email_or_phone.phone.label'),
      helper: i18n.t('civic_center_service:form.email_or_phone.phone.helper'),
      min: i18n.t('civic_center_service:form.email_or_phone.phone.min'),
      max: i18n.t('civic_center_service:form.email_or_phone.phone.max'),
    },
    description: {
      max: i18n.t('civic_center_service:form.email_or_phone.description.max'),
      pattern: i18n.t('civic_center_service:form.email_or_phone.description.pattern'),
      label: i18n.t('civic_center_service:form.email_or_phone.description.label'),
      placeholder: i18n.t('civic_center_service:form.email_or_phone.description.placeholder'),
    },
  },
  physical: {
    toggle: {
      label: i18n.t('civic_center_service:form.physical.toggle.label'),
    },
    address: {
      required: i18n.t('civic_center_service:form.physical.address.required'),
      pattern: i18n.t('civic_center_service:form.physical.address.pattern'),
      max: i18n.t('civic_center_service:form.physical.address.max'),
      label: i18n.t('civic_center_service:form.physical.address.label'),
      helper: i18n.t('civic_center_service:form.physical.address.helper'),
    },
    description: {
      max: i18n.t('civic_center_service:form.physical.description.max'),
      label: i18n.t('civic_center_service:form.physical.description.label'),
      placeholder: i18n.t('civic_center_service:form.physical.description.placeholder'),
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CivicCenterFormConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: translations.name.required,
      },
      maxLength: {
        value: 50,
        message: translations.name.max,
      },
      minLength: {
        value: 3,
        message: translations.name.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.name.pattern,
      },
    },
    config: {
      type: 'text',
      label: translations.name.label,
      helperText: translations.name.helper,
      placeholder: translations.name.placeholder,
    },
  },
  location: {
    key: 'location',
    label: translations.location.label,
    rules: {
      required: {
        value: 'true',
        message: translations.location.required,
      },
    },
    helperText: translations.location.helper,
    placeholder: translations.location.placeholder,
  },
  startDate: {
    key: 'startDate',
    rules: {
      required: {
        value: true,
        message: translations.startDate.required,
      },
    },
    config: {
      label: translations.startDate.label,
      helperText: translations.startDate.helper,
      placeholder: translations.startDate.placeholder,
    },
  },
  endDate: {
    key: 'endDate',
    rules: {},
    config: {
      label: translations.endDate.label,
      helperText: translations.endDate.helper,
      placeholder: translations.endDate.placeholder,
    },
  },
  isPeriodNotDetermined: {
    key: 'isPeriodNotDetermined',
    rules: {},
    config: {
      type: 'checkbox',
      label: translations.isPeriodNotDetermined.label,
      helperText: translations.isPeriodNotDetermined.helper,
    },
  },
  shortDescription: {
    key: 'shortDescription',
    rules: {
      required: {
        value: true,
        message: translations.shortDescription.required,
      },
      maxLength: {
        value: 250,
        message: translations.shortDescription.max,
      },
      minLength: {
        value: 3,
        message: translations.shortDescription.min,
      },
    },
    config: {
      type: 'text',
      label: translations.shortDescription.label,
      helperText: translations.shortDescription.helper,
      placeholder: translations.shortDescription.placeholder,
    },
  },
  longDescription: {
    key: 'longDescription',
    rules: {
      required: {
        value: true,
        message: translations.longDescription.required,
      },
      maxLength: {
        value: 3000,
        message: translations.longDescription.max,
      },
      minLength: {
        value: 3,
        message: translations.longDescription.min,
      },
    },
    config: {
      type: 'text',
      label: translations.longDescription.label,
      helperText: translations.longDescription.helper,
      placeholder: translations.longDescription.placeholder,
    },
  },
  domains: {
    key: 'domains',
    rules: {
      required: {
        value: true,
        message: translations.domains.required,
      },
    },
    config: {
      title: translations.domains.label,
      helperText: translations.domains.helper,
    },
  },
  beneficiaries: {
    key: 'beneficiaries',
    rules: {
      required: {
        value: true,
        message: translations.beneficiaries.required,
      },
    },
    config: {
      title: translations.beneficiaries.label,
      helperText: translations.beneficiaries.helper,
    },
  },
  online: {
    hasOnlineAccess: {
      key: 'hasOnlineAccess',
      rules: {},
      label: translations.online.toggle,
    },
    link: {
      key: 'onlineAccessLink',
      rules: {
        required: {
          value: true,
          message: translations.online.link.required,
        },
        pattern: {
          value: URL_REGEX,
          message: translations.online.link.pattern,
        },
      },
      config: {
        type: 'text',
        label: translations.online.link.label,
        helperText: translations.online.link.helper,
        placeholder: translations.online.link.placeholder,
        addOn: InputFieldHttpAddon,
      },
    },
    description: {
      key: 'onlineAccessDescription',
      rules: {
        maxLength: {
          value: 1000,
          message: translations.online.description.max,
        },
      },
      config: {
        type: 'text',
        label: translations.online.description.label,
        placeholder: translations.online.description.placeholder,
      },
    },
  },
  emailOrPhone: {
    hasEmailPhoneAccess: {
      key: 'hasEmailPhoneAccess',
      rules: {},
      label: translations.emailOrPhone.toggle,
    },
    email: {
      key: 'emailAccess',
      rules: {
        required: {
          value: true,
          message: translations.emailOrPhone.email.required,
        },
        maxLength: {
          value: 50,
          message: translations.emailOrPhone.email.max,
        },
        pattern: {
          value: EMAIL_REGEX,
          message: translations.emailOrPhone.email.pattern,
        },
      },
      config: {
        type: 'text',
        label: translations.emailOrPhone.email.label,
        helperText: translations.emailOrPhone.email.helper,
        placeholder: '',
      },
    },
    phone: {
      key: 'phoneAccess',
      rules: {
        required: {
          value: true,
          message: translations.emailOrPhone.phone.required,
        },
        minLength: {
          value: 10,
          message: translations.emailOrPhone.phone.min,
        },
        maxLength: {
          value: 15,
          message: translations.emailOrPhone.phone.max,
        },
        validate: (value: string) => {
          return isValidPhoneNumber(value) || translations.emailOrPhone.phone.pattern;
        },
      },
      config: {
        type: 'tel',
        label: translations.emailOrPhone.phone.label,
        helperText: translations.emailOrPhone.phone.helper,
        placeholder: '',
      },
    },
    description: {
      key: 'emailPhoneAccessDescription',
      rules: {
        maxLength: {
          value: 1000,
          message: translations.emailOrPhone.description.max,
        },
      },
      config: {
        type: 'text',
        label: translations.emailOrPhone.description.label,
        placeholder: translations.emailOrPhone.description.placeholder,
      },
    },
  },
  physical: {
    hasPhysicalAccess: {
      key: 'hasPhysicalAccess',
      rules: {},
      label: translations.physical.toggle,
    },
    address: {
      key: 'physicalAccessAddress',
      rules: {
        required: {
          value: true,
          message: translations.physical.address.required,
        },
        maxLength: {
          value: 300,
          message: translations.physical.address.max,
        },
      },
      config: {
        type: 'text',
        label: translations.physical.address.label,
        helperText: translations.physical.address.helper,
      },
    },
    description: {
      key: 'physicalAccessDescription',
      rules: {
        maxLength: {
          value: 1000,
          message: translations.physical.description.max,
        },
      },
      config: {
        type: 'text',
        label: translations.physical.description.label,
        placeholder: translations.physical.description.placeholder,
      },
    },
  },
};
