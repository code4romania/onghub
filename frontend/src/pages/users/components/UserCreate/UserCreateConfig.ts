import { NAME_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../../../../common/helpers/format.helper';

export const UserCreateConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: 'Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 5,
        message: 'Name has a minimum length of 5 characters.',
      },
      pattern: {
        value: NAME_REGEX,
        message: 'Name is invalid',
      },
    },
    config: {
      type: 'text',
      label: 'Nume si prenume*',
      helperText: '',
      placeholder: '',
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
      label: 'Email*',
      helperText: '',
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
      maxLength: {
        value: 15,
        message: 'Phone has a maximum length of 15 characters.',
      },
      minLength: {
        value: 12,
        message: 'Phone has a minimum length of 12 characters.',
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
