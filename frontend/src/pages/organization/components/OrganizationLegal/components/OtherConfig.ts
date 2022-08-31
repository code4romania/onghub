import { NAME_REGEX } from '../../../../../common/helpers/format.helper';

export const OtherConfig: Record<string, any> = {
  fullName: {
    key: 'fullName',
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
      placeholder: 'John Doe',
    },
  },
  role: {
    key: 'role',
    rules: {
      required: {
        value: true,
        message: 'Role is required.',
      },
      maxLength: {
        value: 50,
        message: 'Role has a maximum length of 50 characters.',
      },
      minLength: {
        value: 3,
        message: 'Role has a minimum length of 3 characters.',
      },
      pattern: {
        value: NAME_REGEX,
        message: 'Role is invalid',
      },
    },
    config: {
      type: 'text',
      label: 'Rol*',
      helperText: '',
      placeholder: 'Rol',
    },
  },
};
