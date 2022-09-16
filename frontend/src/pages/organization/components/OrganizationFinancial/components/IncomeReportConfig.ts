import { MAX_MONEY } from '../../../constants/values.constants';
import i18n from '../../../../../common/config/i18n';

const translations = {
  minim: i18n.t('financial:common_config.minim'),
  maxim: i18n.t('financial:common_config.maxim'),
  membership: i18n.t('financial:income.membership'),
  donations: i18n.t('financial:income.donations'),
  percent: i18n.t('financial:income.percent'),
  sponsorship: i18n.t('financial:income.sponsorship'),
  economic: i18n.t('financial:income.economic'),
  other: i18n.t('financial:income.other'),
  financial: i18n.t('financial:income.financial'),
};

export const IncomeReportConfig: Record<string, any> = {
  membershipFeeIncome: {
    key: 'membershipFeeIncome',
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
      label: translations.membership,
      placeholder: '1000 RON',
    },
  },
  donationsIncome: {
    key: 'donationsIncome',
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
      label: translations.donations,
      placeholder: '1000 RON',
    },
  },
  twoPercentIncome: {
    key: 'twoPercentIncome',
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
      label: translations.percent,
      placeholder: '1000 RON',
    },
  },
  sponsorshipIncome: {
    key: 'sponsorshipIncome',
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
      label: translations.sponsorship,
      placeholder: '1000 RON',
    },
  },
  economicActivityIncome: {
    key: 'economicActivityIncome',
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
  otherIncome: {
    key: 'otherIncome',
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
      label: translations.other,
      placeholder: '1000 RON',
    },
  },
  financialIncome: {
    key: 'financialIncome',
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
      label: translations.financial,
      placeholder: '1000 RON',
    },
  },
};
