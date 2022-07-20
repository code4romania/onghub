import InputFieldHttpAddon from '../../../../../components/InputField/components/InputFieldHttpAddon';

export const ReportSummaryConfig: Record<string, any> = {
  numberOfVolunteers: {
    key: 'numberOfVolunteers',
    rules: {},
    config: {
      type: 'number',
      label: 'Numar voluntari',
      placeholder: '0',
      helperText: 'Make your password short and easy to guess',
    },
  },
  numberOfContractors: {
    key: 'numberOfContractors',
    rules: {},
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
