export const OrganizationLegalConfig: Record<string, any> = {
  legal_reprezentative_name: {
    key: 'legalReprezentative.fullName',
    rules: {
      required: {
        value: true,
        message: 'Legal Representative Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Legal Representative name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 1,
        message: 'Legal Representative Name has a minimum length of 1 characters.',
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
    key: 'legalReprezentative.email',
    rules: {
      required: {
        value: true,
        message: 'Legal Representative Email is required.',
      },
      maxLength: {
        value: 50,
        message: 'Legal Representative Email has a maximum length of 50 characters.',
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
    key: 'legalReprezentative.phone',
    rules: {
      required: {
        value: true,
        message: 'Legal Representative Name is required.',
      },
      maxLength: {
        value: 10,
        message: 'Legal Representative phone has a maximum length of 10 characters.',
      },
      minLength: {
        value: 10,
        message: 'Legal Representative phone has a minimum length of 10 characters.',
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
