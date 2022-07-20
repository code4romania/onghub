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
        value: 1,
        message: 'Name has a minimum length of 1 characters.',
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
    },
    config: {
      type: 'text',
      label: 'Rol*',
      helperText: '',
      placeholder: 'director',
    },
  },
};
