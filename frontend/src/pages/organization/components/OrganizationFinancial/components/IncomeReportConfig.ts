export const IncomeReportConfig: Record<string, any> = {
  membershipFeeIncome: {
    key: 'membershipFeeIncome',
    rules: {
      min: {
        value: 0,
        message: 'Membership Fee Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: 'Membership Fee Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Venituri din cotizatii',
      placeholder: '1000 RON',
    },
  },
  donationsIncome: {
    key: 'donationsIncome',
    rules: {
      min: {
        value: 0,
        message: 'Donations Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: 'Donations Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Venituri din donatii',
      placeholder: '1000 RON',
    },
  },
  twoPercentIncome: {
    key: 'twoPercentIncome',
    rules: {
      min: {
        value: 0,
        message: '2% Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: '2% Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Venituri 2%',
      placeholder: '1000 RON',
    },
  },
  sponsorshipIncome: {
    key: 'sponsorshipIncome',
    rules: {
      min: {
        value: 0,
        message: 'Sponsorship Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: 'Sponsorship Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Venituri din sponsorizari',
      placeholder: '1000 RON',
    },
  },
  economicActivityIncome: {
    key: 'economicActivityIncome',
    rules: {
      min: {
        value: 0,
        message: 'Economic Activity Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: 'Economic Activity Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Venituri din activitatea economica',
      placeholder: '1000 RON',
    },
  },
  otherIncome: {
    key: 'otherIncome',
    rules: {
      min: {
        value: 0,
        message: 'Other Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: 'Other Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Alte venituri',
      placeholder: '1000 RON',
    },
  },
  financialIncome: {
    key: 'financialIncome',
    rules: {
      min: {
        value: 0,
        message: 'Financial Income cannot have negative values',
      },
      max: {
        value: 1000000000,
        message: 'Finacial Income has a limit of 1 billion.',
      },
    },
    config: {
      type: 'number',
      label: 'Venituri financiare',
      placeholder: '1000 RON',
    },
  },
};
