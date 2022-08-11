import { MAX_MONEY } from '../../../constants/values.constants';

export const ExpenseReportConfig: Record<string, any> = {
  netSalaries: {
    key: 'netSalaries',
    rules: {
      min: {
        value: 0,
        message: 'Net Salaries cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Net Salaries has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Salarii nete (resurse umane)',
      placeholder: '1000 RON',
    },
  },
  cas: {
    key: 'cas',
    rules: {
      min: {
        value: 0,
        message: 'CAS cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'CAS has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Contributii CAS (resurse umane)',
      placeholder: '1000 RON',
    },
  },
  economicActivityDirectExpense: {
    key: 'economicActivityDirectExpense',
    rules: {
      min: {
        value: 0,
        message: 'Economic Activity Direct Expense cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Economic Activity Direct Expense has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Cheltuieli directe din activitatea aconomica',
      placeholder: '1000 RON',
    },
  },
  administrativeExpense: {
    key: 'administrativeExpense',
    rules: {
      min: {
        value: 0,
        message: 'Administrative Expense cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Administrative Expense has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Cheltuieli administrative',
      placeholder: '1000 RON',
    },
  },
  transportAndAccommodation: {
    key: 'transportAndAccommodation',
    rules: {
      min: {
        value: 0,
        message: 'Transport and Accommodation cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Transport and Accommodation has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Transport si cazare',
      placeholder: '1000 RON',
    },
  },
  catering: {
    key: 'catering',
    rules: {
      min: {
        value: 0,
        message: 'Catering cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Catering has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Catering',
      placeholder: '1000 RON',
    },
  },
  production: {
    key: 'production',
    rules: {
      min: {
        value: 0,
        message: 'Production cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Production has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Productie',
      placeholder: '1000 RON',
    },
  },
  softwareServices: {
    key: 'softwareServices',
    rules: {
      min: {
        value: 0,
        message: 'Software Services cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Software Services has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Servicii Software',
      placeholder: '1000 RON',
    },
  },
  advertising: {
    key: 'advertising',
    rules: {
      min: {
        value: 0,
        message: 'Advertising cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Advertising has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Reclama si publicitate',
      placeholder: '1000 RON',
    },
  },
  otherTaxes: {
    key: 'otherTaxes',
    rules: {
      min: {
        value: 0,
        message: 'Other Taxes cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Other Taxes has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Alte taxe',
      placeholder: '1000 RON',
    },
  },
  otherExpense: {
    key: 'otherExpense',
    rules: {
      min: {
        value: 0,
        message: 'Other Expense cannot have negative values',
      },
      max: {
        value: MAX_MONEY,
        message: 'Other Expense has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Alte cheltuieli',
      placeholder: '1000 RON',
    },
  },
};
