import { URL_REGEX } from '../../../../../common/helpers/format.helper';
import InputFieldHttpAddon from '../../../../../components/InputField/components/InputFieldHttpAddon';
import { MAX_REPORT } from '../../../constants/values.constants';
import i18n from '../../../../../common/config/i18n';

const translations = {
  volunteer_negative: i18n.t('open_data:config.volunt_negative'),
  volunteer_maxim: i18n.t('open_data:config.volunt_maxim'),
  contractor_negative: i18n.t('open_data:config.contr_negative'),
  contractor_maxim: i18n.t('open_data:config.contr_maxim'),
  decimal: i18n.t('open_data:config.decimal'),
  link_invalid: i18n.t('open_data:config.link_invalid'),
  link: i18n.t('open_data:config.link'),
  volunteers: i18n.t('open_data:config.volunteers'),
  contractors: i18n.t('open_data:config.contractors'),
  volunteer_helper: i18n.t('open_data:config.volunteer_helper'),
  contractor_helper: i18n.t('open_data:config.contractor_helper'),
  report_helper: i18n.t('open_data:config.report_helper'),
};

export const ReportSummaryConfig: Record<string, any> = {
  numberOfVolunteers: {
    key: 'numberOfVolunteers',
    rules: {
      min: {
        value: 0,
        message: translations.volunteer_negative,
      },
      max: {
        value: MAX_REPORT,
        message: translations.volunteer_maxim,
      },
      validate: {
        decimal: (value: number) => value % 1 == 0 || translations.decimal,
      },
    },
    config: {
      type: 'number',
      label: translations.volunteers,
      placeholder: '0',
      helperText: translations.volunteer_helper,
    },
  },
  numberOfContractors: {
    key: 'numberOfContractors',
    rules: {
      min: {
        value: 0,
        message: translations.contractor_negative,
      },
      max: {
        value: MAX_REPORT,
        message: translations.contractor_maxim,
      },
      validate: {
        decimal: (value: number) => value % 1 == 0 || translations.decimal,
      },
    },
    config: {
      type: 'number',
      label: translations.contractors,
      placeholder: '0',
      helperText: translations.contractor_helper,
    },
  },
  report: {
    key: 'report',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: translations.link_invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.link,
      placeholder: 'www.example.com',
      helperText: translations.report_helper,
      addOn: InputFieldHttpAddon,
    },
  },
};
