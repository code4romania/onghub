import { ALPHANUMERIC_REGEX, URL_REGEX } from '../../../common/helpers/format.helper';
import i18n from '../../../common/config/i18n';
import InputFieldHttpAddon from '../../../components/InputField/components/InputFieldHttpAddon';

const translations = {
  title: {
    required: i18n.t('practice_program:form.title.required'),
    max: i18n.t('practice_program:form.title.max'),
    min: i18n.t('practice_program:form.title.min'),
    pattern: i18n.t('practice_program:form.title.pattern'),
    label: i18n.t('practice_program:form.title.label'),
    helper: i18n.t('practice_program:form.title.helper'),
    placeholder: i18n.t('practice_program:form.title.placeholder'),
  },
  location: {
    required: i18n.t('practice_program:form.location.required'),
    label: i18n.t('practice_program:form.location.label'),
    helper: i18n.t('practice_program:form.location.helper'),
    placeholder: i18n.t('practice_program:form.location.placeholder'),
  },
  deadline: {
    label: i18n.t('practice_program:form.deadline.label'),
    helper: i18n.t('practice_program:form.deadline.helper'),
    placeholder: i18n.t('practice_program:form.deadline.placeholder'),
  },
  description: {
    required: i18n.t('practice_program:form.description.required'),
    max: i18n.t('practice_program:form.description.max'),
    min: i18n.t('practice_program:form.description.min'),
    pattern: i18n.t('practice_program:form.description.pattern'),
    label: i18n.t('practice_program:form.description.label'),
    helper: i18n.t('practice_program:form.description.helper'),
    placeholder: i18n.t('practice_program:form.description.placeholder'),
  },
  startDate: {
    required: i18n.t('practice_program:form.start_date.required'),
    label: i18n.t('practice_program:form.start_date.label'),
    helper: i18n.t('practice_program:form.start_date.helper'),
    placeholder: i18n.t('practice_program:form.start_date.placeholder'),
  },
  endDate: {
    label: i18n.t('practice_program:form.end_date.label'),
    helper: i18n.t('practice_program:form.end_date.helper'),
    placeholder: i18n.t('practice_program:form.end_date.placeholder'),
  },
  isPeriodNotDetermined: {
    label: i18n.t('practice_program:form.is_period_not_determined.label'),
    helper: i18n.t('practice_program:form.is_period_not_determined.helper'),
  },
  minWorkingHours: {
    required: i18n.t('practice_program:form.min_working_hours.required'),
    min: i18n.t('practice_program:form.min_working_hours.min'),
    label: i18n.t('practice_program:form.min_working_hours.label'),
    helper: i18n.t('practice_program:form.min_working_hours.helper'),
    placeholder: i18n.t('practice_program:form.min_working_hours.placeholder'),
  },
  maxWorkingHours: {
    required: i18n.t('practice_program:form.max_working_hours.required'),
    min: i18n.t('practice_program:form.max_working_hours.min'),
    label: i18n.t('practice_program:form.max_working_hours.label'),
    helper: i18n.t('practice_program:form.max_working_hours.helper'),
    placeholder: i18n.t('practice_program:form.max_working_hours.placeholder'),
  },
  link: {
    pattern: i18n.t('practice_program:form.link.pattern'),
    label: i18n.t('practice_program:form.link.label'),
    helper: i18n.t('practice_program:form.link.helper'),
    placeholder: i18n.t('practice_program:form.link.placeholder'),
  },
  domains: {
    required: i18n.t('practice_program:form.domains.required'),
    label: i18n.t('practice_program:form.domains.label'),
    helper: i18n.t('practice_program:form.domains.helper'),
  },
  skills: {
    label: i18n.t('practice_program:form.skills.label'),
    helper: i18n.t('practice_program:form.skills.helper'),
    placeholder: i18n.t('practice_program:form.skills.placeholder'),
  },
  faculties: {
    label: i18n.t('practice_program:form.faculties.label'),
    helper: i18n.t('practice_program:form.faculties.helper'),
    placeholder: i18n.t('practice_program:form.faculties.placeholder'),
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PracticeProgramFormConfig: Record<string, any> = {
  title: {
    key: 'title',
    rules: {
      required: {
        value: true,
        message: translations.title.required,
      },
      maxLength: {
        value: 50,
        message: translations.title.max,
      },
      minLength: {
        value: 3,
        message: translations.title.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.title.pattern,
      },
    },
    config: {
      type: 'text',
      label: translations.title.label,
      helperText: translations.title.helper,
      placeholder: translations.title.placeholder,
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
  deadline: {
    key: 'deadline',
    rules: {},
    config: {
      label: translations.deadline.label,
      helperText: translations.deadline.helper,
      placeholder: translations.deadline.placeholder,
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
        value: 3000,
        message: translations.description.max,
      },
      minLength: {
        value: 3,
        message: translations.description.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.description.pattern,
      },
    },
    config: {
      type: 'text',
      label: translations.description.label,
      helperText: translations.description.helper,
      placeholder: translations.description.placeholder,
    },
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
  minWorkingHours: {
    key: 'minWorkingHours',
    rules: {
      required: {
        value: true,
        message: translations.minWorkingHours.required,
      },
      min: {
        value: 0,
        message: translations.minWorkingHours.min,
      },
    },
    config: {
      type: 'number',
      label: translations.minWorkingHours.label,
      helper: translations.minWorkingHours.label,
      placeholder: translations.minWorkingHours.placeholder,
    },
  },
  maxWorkingHours: {
    key: 'maxWorkingHours',
    rules: {
      required: {
        value: true,
        message: translations.maxWorkingHours.required,
      },
      min: {
        value: 0,
        message: translations.maxWorkingHours.min,
      },
    },
    config: {
      type: 'number',
      label: translations.maxWorkingHours.label,
      helper: translations.maxWorkingHours.label,
      placeholder: translations.maxWorkingHours.placeholder,
    },
  },
  link: {
    key: 'link',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: translations.link.pattern,
      },
    },
    config: {
      type: 'text',
      label: translations.link.label,
      helperText: translations.link.helper,
      placeholder: translations.link.placeholder,
      addOn: InputFieldHttpAddon,
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
  skills: {
    key: 'skills',
    rules: {},
    config: {
      type: 'text',
      label: translations.skills.label,
      helperText: translations.skills.helper,
      placeholder: translations.skills.placeholder,
    },
  },
  faculties: {
    key: 'faculties',
    rules: {},
    config: {
      type: 'text',
      label: translations.faculties.label,
      helperText: translations.faculties.helper,
      placeholder: translations.faculties.placeholder,
    },
  },
};
