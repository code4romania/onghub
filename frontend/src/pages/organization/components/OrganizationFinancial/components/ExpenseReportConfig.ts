import { MAX_MONEY } from '../../../constants/values.constants';
import i18n from '../../../../../common/config/i18n';

const translations = {
  minim: i18n.t('financial:common_config.minim'),
  maxim: i18n.t('financial:common_config.maxim'),
  net: { label: i18n.t('financial:expense.net.label'), info: i18n.t('financial:expense.net.info') },
  cas: { label: i18n.t('financial:expense.cas.label'), info: i18n.t('financial:expense.cas.info') },
  economic: {
    label: i18n.t('financial:expense.economic.label'),
    info: i18n.t('financial:expense.economic.info'),
  },
  administrative: {
    label: i18n.t('financial:expense.administrative.label'),
    info: i18n.t('financial:expense.administrative.info'),
  },
  transport: {
    label: i18n.t('financial:expense.transport.label'),
    info: i18n.t('financial:expense.transport.info'),
  },
  catering: {
    label: i18n.t('financial:expense.catering.label'),
    info: i18n.t('financial:expense.catering.info'),
  },
  production: {
    label: i18n.t('financial:expense.production.label'),
    info: i18n.t('financial:expense.production.info'),
  },
  software: {
    label: i18n.t('financial:expense.software.label'),
    info: i18n.t('financial:expense.software.info'),
  },
  advertising: {
    label: i18n.t('financial:expense.advertising.label'),
    info: i18n.t('financial:expense.advertising.info'),
  },
  taxes: {
    label: i18n.t('financial:expense.taxes.label'),
    info: i18n.t('financial:expense.taxes.info'),
  },
  expense: {
    label: i18n.t('financial:expense.expense.label'),
    info: i18n.t('financial:expense.expense.info'),
  },
};

export const ExpenseReportConfig: Record<string, any> = {
  netSalaries: {
    key: 'netSalaries',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.net.label,
      info: translations.net.info,
      placeholder: '1000 RON',
    },
  },
  cas: {
    key: 'cas',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.cas.label,
      info: translations.cas.info,
      placeholder: '1000 RON',
    },
  },
  economicActivityDirectExpense: {
    key: 'economicActivityDirectExpense',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.economic.label,
      info: translations.economic.info,
      placeholder: '1000 RON',
    },
  },
  administrativeExpense: {
    key: 'administrativeExpense',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.administrative.label,
      info: translations.administrative.info,
      placeholder: '1000 RON',
    },
  },
  transportAndAccommodation: {
    key: 'transportAndAccommodation',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.transport.label,
      info: translations.transport.info,
      placeholder: '1000 RON',
    },
  },
  catering: {
    key: 'catering',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.catering.label,
      info: translations.catering.info,
      placeholder: '1000 RON',
    },
  },
  production: {
    key: 'production',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.production.label,
      info: translations.production.info,
      placeholder: '1000 RON',
    },
  },
  softwareServices: {
    key: 'softwareServices',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.software.label,
      info: translations.software.info,
      placeholder: '1000 RON',
    },
  },
  advertising: {
    key: 'advertising',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.advertising.label,
      info: translations.advertising.info,
      placeholder: '1000 RON',
    },
  },
  otherTaxes: {
    key: 'otherTaxes',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.taxes.label,
      info: translations.taxes.info,
      placeholder: '1000 RON',
    },
  },
  otherExpense: {
    key: 'otherExpense',
    rules: {
      min: {
        value: 0,
        message: translations.minim,
      },
      max: {
        value: MAX_MONEY,
        message: translations.maxim,
      },
    },
    config: {
      type: 'number',
      label: translations.expense.label,
      info: translations.expense.info,
      placeholder: '1000 RON',
    },
  },
};
