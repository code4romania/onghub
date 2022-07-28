import { NAME_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../../../../../common/helpers/format.helper';

export const DirectorConfig: Record<string, any> = {
  fullName: {
    key: 'fullName',
    rules: {
      required: {
        value: true,
        message: 'Director Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Director name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 5,
        message: 'Director name has a minimum length of 5 characters.',
      },
      pattern: {
        value: NAME_REGEX,
        message: 'Director name is invalid',
      },
    },
    config: {
      type: 'text',
      label: 'Nume si prenume*',
      helperText: '',
      placeholder: 'John Doe',
    },
  },
  email: {
    key: 'email',
    rules: {
      required: {
        value: true,
        message: 'Director Email is required.',
      },
      maxLength: {
        value: 50,
        message: 'Director Email has a maximum length of 50 characters.',
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
      placeholder: 'example@email.com',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      required: {
        value: true,
        message: 'Director Name is required.',
      },
      maxLength: {
        value: 10,
        message: 'Director phone has a maximum length of 10 characters.',
      },
      minLength: {
        value: 10,
        message: 'Director phone has a minimum length of 10 characters.',
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
      placeholder: '0721111111',
    },
  },
};
