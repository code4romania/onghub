import { ALPHANUMERIC_REGEX, URL_REGEX } from '../../../common/helpers/format.helper';
import InputFieldHttpAddon from '../../../components/InputField/components/InputFieldHttpAddon';
import { ApplicationTypeEnum, ApplicationTypeNaming } from '../constants/ApplicationType.enum';

export const AddAppConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: 'Application Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Application Name has a maximum length of 100 characters.',
      },
      minLength: {
        value: 3,
        message: 'Application Name has a minimum length of 3 characters.',
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: 'Invalid format',
      },
    },
    config: {
      type: 'text',
      label: 'Denumirea aplicatiei*',
      helperText: 'Alege o denumire de maximum 100 de caractere',
      placeholder: '',
    },
  },
  type: {
    key: 'type',
    label: 'Tipul aplicatie*',
    rules: {
      required: {
        value: true,
        message: 'Type is required.',
      },
    },
    helperText: '',
    radioConfigs: [
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.INDEPENDENT],
        name: 'type',
        value: ApplicationTypeEnum.INDEPENDENT,
      },
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.DATA_PULLING],
        name: 'type',
        value: ApplicationTypeEnum.DATA_PULLING,
      },
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.SIMPLE],
        name: 'type',
        value: ApplicationTypeEnum.SIMPLE,
      },
      {
        label: ApplicationTypeNaming[ApplicationTypeEnum.STANDALONE],
        name: 'type',
        value: ApplicationTypeEnum.STANDALONE,
      },
    ],
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
        value: 50,
        message: 'Short description has a minimum length of 50 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Descriere scurta*',
      helperText: 'Maximum 250 de caractere',
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
        message: 'Description has a maximum length of 1000 characters.',
      },
      minLength: {
        value: 200,
        message: 'Description has a minimum length of 200 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Descriere exstinsa organizatiei*',
      helperText: 'Maximum 1000 de caractere',
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
      label: 'Link catre website prezentare aplicatie*',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  loginLink: {
    key: 'loginLink',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
      required: {
        value: true,
        message: 'Login lik is required.',
      },
    },
    config: {
      type: 'text',
      label: 'Link login automat*',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  videoLink: {
    key: 'videoLink',
    rules: {
      required: {
        value: true,
        message: 'Vide link is required.',
      },
      pattern: {
        value: URL_REGEX,
        message: 'URL format must be valid',
      },
    },
    config: {
      type: 'text',
      label: 'Link video prezentare*',
      helperText:
        'URL-ul trebuie sa fie de forma embed de pe YT. (exemplu: https://www.youtube.com/embed/r23xQuM7jVo)',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  step: {
    key: 'step',
    rules: {
      required: {
        value: true,
        message: 'Step is required.',
      },
    },
    config: {
      type: 'text',
      label: 'Pas',
      helperText: '',
      placeholder: '',
    },
  },
};
