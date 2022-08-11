import {
  ALPHANUMERIC_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
} from '../../../common/helpers/format.helper';

export const CreateOrganizationUserConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: 'First name and last name field is required.',
      },
      maxLength: {
        value: 100,
        message: 'First name and last name field has a maximum length of 100 characters.',
      },
      minLength: {
        value: 3,
        message: 'First name and last name field has a minimum length of 3 characters.',
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: 'Invalid format',
      },
    },
    config: {
      type: 'text',
      label: 'Nume si prenume',
      helperText: '',
      placeholder: 'Ana Maria Stoian',
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
        value: 12,
        message: 'Phone has a minimum length of 12 characters.',
      },
      maxLength: {
        value: 15,
        message: 'Phone has a maximum length of 15 characters.',
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
      placeholder: '+40712345678',
    },
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
      label: 'E-mail',
      helperText: '',
      placeholder: 'you@example.com',
    },
  },
};
