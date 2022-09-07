import { MAX_MONEY } from '../../../constants/values.constants';
import i18n from '../../../../../common/config/i18n';

const translations = {
  minim: i18n.t('financial:common_config.minim'),
  maxim: i18n.t('financial:common_config.maxim'),
  net: i18n.t('financial:expense.net'),
  cas: i18n.t('financial:expense.cas'),
  economic: i18n.t('financial:expense.economic'),
  administrative: i18n.t('financial:expense.administrative'),
  transport: i18n.t('financial:expense.transport'),
  catering: i18n.t('financial:expense.catering'),
  production: i18n.t('financial:expense.production'),
  software: i18n.t('financial:expense.software'),
  advertising: i18n.t('financial:expense.advertising'),
  taxes: i18n.t('financial:expense.taxes'),
  expense: i18n.t('financial:expense.expense'),
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
      label: translations.net,
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
      label: translations.cas,
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
      label: translations.economic,
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
      label: translations.administrative,
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
      label: translations.transport,
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
      label: translations.catering,
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
      label: translations.production,
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
      label: translations.software,
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
      label: translations.advertising,
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
      label: translations.taxes,
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
      label: translations.expense,
      placeholder: '1000 RON',
    },
  },
};
