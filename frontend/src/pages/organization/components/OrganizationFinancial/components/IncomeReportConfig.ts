import { MAX_MONEY } from '../../../constants/values.constants';
import i18n from '../../../../../common/config/i18n';

const translations = {
  minim: i18n.t('financial:common_config.minim'),
  maxim: i18n.t('financial:common_config.maxim'),
  membership: {
    label: i18n.t('financial:income.membership.label'),
    info: i18n.t('financial:income.membership.info'),
  },
  donations: {
    label: i18n.t('financial:income.donations.label'),
    info: i18n.t('financial:income.donations.info'),
  },
  percent: {
    label: i18n.t('financial:income.percent.label'),
    info: i18n.t('financial:income.percent.info'),
  },
  sponsorship: {
    label: i18n.t('financial:income.sponsorship.label'),
    info: i18n.t('financial:income.sponsorship.info'),
  },
  economic: {
    label: i18n.t('financial:income.economic.label'),
    info: i18n.t('financial:income.economic.info'),
  },
  other: {
    label: i18n.t('financial:income.other.label'),
    info: i18n.t('financial:income.other.info'),
  },
  financial: {
    label: i18n.t('financial:income.financial.label'),
    info: i18n.t('financial:income.financial.info'),
  },
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
      label: translations.membership.label,
      info: translations.membership.info,
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
      label: translations.donations.label,
      info: translations.donations.info,
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
      label: translations.percent.label,
      info: translations.percent.info,
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
      label: translations.sponsorship.label,
      info: translations.sponsorship.info,
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
      label: translations.economic.label,
      info: translations.economic.info,
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
      label: translations.other.label,
      info: translations.other.info,
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
      label: translations.financial.label,
      info: translations.financial.info,
      placeholder: '1000 RON',
    },
  },
};
