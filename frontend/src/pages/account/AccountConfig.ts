import { useTranslation } from 'react-i18next';
import { PASSWORD_REGEX } from '../../common/helpers/format.helper';

export const AccountConfig: Record<string, any> = {
  oldPassword: {
    key: 'oldPassword',
    rules: {
      required: {
        value: true,
        message: 'Old password is required.',
      },
      pattern: {
        value: PASSWORD_REGEX,
        message: 'Password is invalid',
      },
    },
    config: {
      type: 'password',
      label: 'Parola curenta*',
      helperText: '',
      placeholder: '',
    },
  },
  newPassword: {
    key: 'newPassword',
    rules: {
      required: {
        value: true,
        message: 'New password is required.',
      },
      pattern: {
        value: PASSWORD_REGEX,
        message:
          'Password is invalid. It must have at least 8 characters, a special character (?, = *, etc.), a lowercase letter, an uppercase letter, and a number.',
      },
    },
    config: {
      type: 'password',
      label: 'Parola noua*',
      helperText: '',
      placeholder: '',
    },
  },
  matchPassword: {
    key: 'matchPassword',
    rules: {
      required: {
        value: true,
        message: 'New password is required.',
      },
      pattern: {
        value: PASSWORD_REGEX,
        message:
          'Password is invalid. It must have at least 8 characters, a special character (?, = *, etc.), a lowercase letter, an uppercase letter, and a number.',
      },
    },
    config: {
      type: 'password',
      label: 'Confirma Parola noua*',
      helperText: '',
      placeholder: '',
    },
  },
};
