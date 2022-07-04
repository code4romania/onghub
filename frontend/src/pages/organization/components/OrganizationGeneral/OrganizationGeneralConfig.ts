import { OrganizationTypeEnum } from './../../enums/OrganizationType.enum';

export const OrganizationGeneralConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: 'Organization Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Organization Name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 3,
        message: 'Organization Name has a minimum length of 3 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Denumirea organizatiei*',
      helperText: 'Denumirea oficiala, conform cu Registrul ONG',
      placeholder: '',
    },
  },
  alias: {
    key: 'alias',
    rules: {
      required: {
        value: true,
        message: 'Organization Alias is required.',
      },
      maxLength: {
        value: 100,
        message: 'Organization Name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 3,
        message: 'Organization Name has a minimum length of 3 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Alias organizatie*',
      helperText: '',
      placeholder: '',
    },
  },
  type: {
    key: 'type',
    label: 'Tip organizatie*',
    rules: {
      required: {
        value: true,
        message: 'Organization Type is required.',
      },
    },
    radioConfigs: [
      {
        label: 'Asociatie',
        name: 'type',
        value: OrganizationTypeEnum.ASSOCIATION,
      },
      {
        label: 'Fundatie',
        name: 'type',
        value: OrganizationTypeEnum.FOUNDATION,
      },
    ],
  },
  email: {
    key: 'email',
    rules: {
      required: {
        value: true,
        message: 'Email is required.',
      },
      maxLength: {
        value: 50,
        message: 'Email has a maximum length of 50 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'E-mail contact organizatie*',
      helperText: '',
      placeholder: '',
    },
  },
  yearCreated: {
    key: 'yearCreated',
    rules: {
      required: {
        value: true,
        message: 'Year of creation is required.',
      },
      maxLength: {
        value: 4,
        message: 'Year of creation has a maximum length of 4 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Anul infiintarii*',
      collection: [
        { id: 1, year: 2019 },
        { id: 1, year: 2020 },
        { id: 1, year: 2022 },
      ],
      displayedAttribute: 'year',
    },
  },
  cui: {
    key: 'cui',
    rules: {
      required: {
        value: true,
        message: 'Organization CUI is required.',
      },
      maxLength: {
        value: 12,
        message: 'Organization CUI has a maximum length of 12 characters.',
      },
      minLength: {
        value: 2,
        message: 'Organization CUI has a maximum length of 2 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'CUI/CIF*',
      helperText: '',
      placeholder: '',
    },
  },
  rafNumber: {
    key: 'rafNumber',
    rules: {
      required: {
        value: true,
        message: 'Organization Register of asociations and Foundations Number is required.',
      },
      maxLength: {
        value: 12,
        message:
          'Organization Register of asociations and Foundations Number has a maximum length of 12 characters.',
      },
      minLength: {
        value: 10,
        message:
          'Organization Register of asociations and Foundations Number has a maximum length of 10 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'CUI/CIF*',
      helperText: '',
      placeholder: '',
    },
  },
  city: {
    key: 'city',
    rules: {
      required: {
        value: true,
        message: 'City is required.',
      },
    },
    config: {
      type: 'text',
      label: 'Oras*',
      collection: [
        { id: 1, year: 2019 },
        { id: 1, year: 2020 },
        { id: 1, year: 2022 },
      ],
      displayedAttribute: 'year',
    },
  },
  county: {
    key: 'county',
    rules: {
      required: {
        value: true,
        message: 'County is required.',
      },
    },
    config: {
      type: 'text',
      label: 'Judet*',
      collection: [
        { id: 1, year: 2019 },
        { id: 1, year: 2020 },
        { id: 1, year: 2022 },
      ],
      displayedAttribute: 'year',
    },
  },
};
