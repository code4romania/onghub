import {
  ALPHANUMERIC_REGEX,
  CUI_REGEX,
  NAME_REGEX,
  NUMERIC_REGEX,
  RAF_NUMBER_REGEX,
  rangeOfYears,
  EMAIL_REGEX,
} from './../../../../common/helpers/format.helper';
import { PHONE_REGEX, URL_REGEX } from '../../../../common/helpers/format.helper';
import InputFieldHttpAddon from '../../../../components/InputField/components/InputFieldHttpAddon';
import { OrganizationTypeEnum, OrganizationTypeNaming } from './../../enums/OrganizationType.enum';

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
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: 'Invalid format',
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
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: 'Invalid format',
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
    helperText: 'De exemplu lorem impsum. Help text',
    radioConfigs: [
      {
        label: OrganizationTypeNaming[OrganizationTypeEnum.ASSOCIATION],
        name: 'type',
        value: OrganizationTypeEnum.ASSOCIATION,
      },
      {
        label: OrganizationTypeNaming[OrganizationTypeEnum.FOUNDATION],
        name: 'type',
        value: OrganizationTypeEnum.FOUNDATION,
      },
      {
        label: OrganizationTypeNaming[OrganizationTypeEnum.FEDERATION],
        name: 'type',
        value: OrganizationTypeEnum.FEDERATION,
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
      pattern: {
        value: EMAIL_REGEX,
        message: 'Email format is invalid',
      },
    },
    config: {
      type: 'text',
      label: 'E-mail contact organizatie*',
      helperText: 'Exemplu: contact@organizatie.ro',
      placeholder: '',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      required: {
        value: true,
        message: 'Phone is required.',
      },
      minLength: {
        value: 10,
        message: 'Phone has a minimum length of 10 characters.',
      },
      maxLength: {
        value: 10,
        message: 'Phone has a maximum length of 10 characters.',
      },
      pattern: {
        value: PHONE_REGEX,
        message: 'Invalid phone format',
      },
    },
    config: {
      type: 'tel',
      label: 'Telefon contact organizatie*',
      helperText: 'Exemplu: numarul telefonului de la sediu',
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
      collection: rangeOfYears(1800),
      displayedAttribute: '',
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
      pattern: {
        value: CUI_REGEX,
        message: 'CUI format is invalid.',
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
        message: 'Organization Register of associations and Foundations Number is required.',
      },
      maxLength: {
        value: 20,
        message:
          'Organization Register of associations and Foundations Number has a maximum length of 20 characters.',
      },
      pattern: {
        value: RAF_NUMBER_REGEX,
        message: 'Invalid format',
      },
    },
    config: {
      type: 'text',
      label: 'Nr. Registrul Asociațiilor și Fundațiilor*',
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
        { id: 2, year: 2020 },
        { id: 3, year: 2022 },
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
      displayedAttribute: 'year',
    },
  },
  shortDescription: {
    key: 'shortDescription',
    rules: {
      required: {
        value: true,
        message: 'Short description is required.',
      },
      maxLength: {
        value: 250,
        message: 'Short description has a maximum length of 250 characters.',
      },
      minLength: {
        value: 1,
        message: 'Short description has a minimum length of 50 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Descriere scurta organizatiei*',
      helperText:
        'Descrie organizatia ta in 200-250 caractere. Descrierea va fi vizibila in alte aplicatii, dupa caz.',
      placeholder: '',
    },
  },
  description: {
    key: 'description',
    rules: {
      required: {
        value: true,
        message: 'Description is required.',
      },
      maxLength: {
        value: 700,
        message: 'Description has a maximum length of 700 characters.',
      },
      minLength: {
        value: 200,
        message: 'Description has a minimum length of 200 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Descriere exstinsa organizatiei*',
      helperText:
        'Adauga o descriere cat mai cuprinzatoare a organizatiei tale. Maximum 500 de caractere',
      placeholder: '',
    },
  },
  contact_name: {
    key: 'contact_fullName',
    rules: {
      required: {
        value: true,
        message: 'Contact Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Contact name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 5,
        message: 'Contact Name has a minimum length of 5 characters.',
      },
      pattern: {
        value: NAME_REGEX,
        message: 'Contact name is invalid',
      },
    },
    config: {
      type: 'text',
      label: 'Nume si prenume*',
      helperText: '',
      placeholder: '',
    },
  },
  contact_email: {
    key: 'contact_email',
    rules: {
      required: {
        value: true,
        message: 'Contact Email is required.',
      },
      maxLength: {
        value: 50,
        message: 'Contact Email has a maximum length of 50 characters.',
      },
      pattern: {
        value: EMAIL_REGEX,
        message: 'Invalid format',
      },
    },
    config: {
      type: 'text',
      label: 'Email*',
      helperText: '',
      placeholder: '',
    },
  },
  contact_phone: {
    key: 'contact_phone',
    rules: {
      required: {
        value: true,
        message: 'Contact Phone is required.',
      },
      maxLength: {
        value: 10,
        message: 'Contact phone has a maximum length of 10 characters.',
      },
      minLength: {
        value: 10,
        message: 'Contact phone has a minimum length of 10 characters.',
      },
      pattern: {
        value: PHONE_REGEX,
        message: 'Invalid phone format',
      },
    },
    config: {
      type: 'tel',
      label: 'Telefon*',
      helperText: '',
      placeholder: '',
    },
  },
  website: {
    key: 'website',
    rules: {
      required: {
        value: true,
        message: 'Website is required.',
      },
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Website*',
      helperText: 'Make your password short and easy to guess. :)',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  facebook: {
    key: 'facebook',
    rules: {
      required: {
        value: true,
        message: 'Facebook is required.',
      },
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Facebook*',
      helperText: 'Make your password short and easy to guess. :)',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  instagram: {
    key: 'instagram',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Instagram*',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  twitter: {
    key: 'twitter',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Twitter',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  linkedin: {
    key: 'linkedin',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Linkedin',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  tiktok: {
    key: 'tiktok',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Tiktok',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  donationWebsite: {
    key: 'donationWebsite',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Pagina de donatii',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  redirectLink: {
    key: 'redirectLink',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Link catre contul de Redirectioneaza',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  donationSMS: {
    key: 'donationSMS',
    rules: {
      minLength: {
        value: 4,
        message: 'Length of the Donation SMS must be of maximum 4 characters.',
      },
      maxLength: {
        value: 4,
        message: 'Length of the Donation SMS must be of maximum 4 characters.',
      },
      pattern: {
        value: NUMERIC_REGEX,
        message: 'Invalid format',
      },
    },
    config: {
      type: 'text',
      label: 'Donatii prin SMS',
      helperText: 'Numarul la care se trimite SMS pentru a dona.',
      placeholder: '',
    },
  },
  donationKeyword: {
    key: 'donationKeyword',
    rules: {
      maxLength: {
        value: 10,
        message: 'Maximum length of the donation keyword is 10 characters.',
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: 'Invalid format',
      },
    },
    config: {
      type: 'text',
      label: 'Cuvant cheie SMS',
      helperText: 'Textul care se trimite prin SMS pentru a dona',
      placeholder: '',
    },
  },
};
