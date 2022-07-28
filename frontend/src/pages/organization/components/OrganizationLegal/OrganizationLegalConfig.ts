import { NAME_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../../../../common/helpers/format.helper';

export const OrganizationLegalConfig: Record<string, any> = {
  legal_reprezentative_name: {
    key: 'legalReprezentative_fullName',
    rules: {
      required: {
        value: true,
        message: 'Legal Representative name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Legal Representative name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 5,
        message: 'Legal Representative name has a minimum length of 5 characters.',
      },
      pattern: {
        value: NAME_REGEX,
        message: 'Legal Representative name is invalid',
      },
    },
    config: {
      type: 'text',
      label: 'Nume si prenume*',
      helperText: '',
      placeholder: '',
    },
  },
  legal_reprezentative_email: {
    key: 'legalReprezentative_email',
    rules: {
      required: {
        value: true,
        message: 'Legal Representative Email is required.',
      },
      maxLength: {
        value: 50,
        message: 'Legal Representative Email has a maximum length of 50 characters.',
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
  legal_reprezentative_phone: {
    key: 'legalReprezentative_phone',
    rules: {
      required: {
        value: true,
        message: 'Legal Representative Phone is required.',
      },
      maxLength: {
        value: 10,
        message: 'Legal Representative phone has a maximum length of 10 characters.',
      },
      minLength: {
        value: 10,
        message: 'Legal Representative phone has a minimum length of 10 characters.',
      },
      pattern: {
        value: PHONE_REGEX,
        message: 'Invalid phone format',
      },
    },
    config: {
      type: 'tel',
      label: 'Telefon',
      helperText: '',
      placeholder: '',
    },
  },
};
