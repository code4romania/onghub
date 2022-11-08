import { ALPHANUMERIC_REGEX } from '../../../common/helpers/format.helper';
import i18n from '../../../common/config/i18n';

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
  ageCategories: {
    label: i18n.t('civic_center_service:form.age_category.label'),
    helper: i18n.t('civic_center_service:form.age_category.helper'),
    required: i18n.t('civic_center_service:form.age_category.required'),
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
        value: 200,
        message: translations.shortDescription.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.shortDescription.pattern,
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
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.longDescription.pattern,
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
  ageCategories: {
    key: 'ageCategories',
    rules: {
      required: {
        value: true,
        message: translations.ageCategories.required,
      },
    },
    config: {
      title: translations.ageCategories.label,
      helperText: translations.ageCategories.helper,
    },
  },
};
