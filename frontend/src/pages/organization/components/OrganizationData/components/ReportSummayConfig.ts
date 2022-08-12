import InputFieldHttpAddon from '../../../../../components/InputField/components/InputFieldHttpAddon';
import { MAX_REPORT } from '../../../constants/values.constants';

export const ReportSummaryConfig: Record<string, any> = {
  numberOfVolunteers: {
    key: 'numberOfVolunteers',
    rules: {
      min: {
        value: 0,
        message: 'Number of volunteers cannot have negative values.',
      },
      max: {
        value: MAX_REPORT,
        message: 'Number of volunteers cannot exceed 6 digits.',
      },
    },
    config: {
      type: 'number',
      label: 'Numar voluntari',
      placeholder: '0',
      helperText: 'Make your password short and easy to guess',
    },
  },
  numberOfContractors: {
    key: 'numberOfContractors',
    rules: {
      min: {
        value: 0,
        message: 'Number of contractors cannot have negative values.',
      },
      max: {
        value: MAX_REPORT,
        message: 'Number of contractors cannot exceed 6 digits.',
      },
    },
    config: {
      type: 'number',
      label: 'Numar contractori',
      placeholder: '0',
      helperText: 'Make your password short and easy to guess',
    },
  },
  report: {
    key: 'report',
    rules: {},
    config: {
      type: 'text',
      label: 'Link raport activitate',
      placeholder: 'www.example.com',
      helperText: 'Make your password short and easy to guess',
      addOn: InputFieldHttpAddon,
    },
  },
};
