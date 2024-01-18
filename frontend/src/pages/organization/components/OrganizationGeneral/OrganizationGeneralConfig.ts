import {
  ALPHANUMERIC_REGEX,
  CUI_REGEX,
  NAME_REGEX,
  SMS_REGEX,
  RAF_NUMBER_REGEX,
  rangeOfYears,
  EMAIL_REGEX,
} from './../../../../common/helpers/format.helper';
import { PHONE_REGEX, URL_REGEX } from '../../../../common/helpers/format.helper';
import InputFieldHttpAddon from '../../../../components/InputField/components/InputFieldHttpAddon';
import { OrganizationTypeEnum, OrganizationTypeNaming } from './../../enums/OrganizationType.enum';
import i18n from '../../../../common/config/i18n';

const translations = {
  url: i18n.t('common:invalid_url'),
  name: {
    required: i18n.t('general:config.name.required'),
    max: i18n.t('general:config.name.max'),
    min: i18n.t('general:config.name.min'),
    invalid: i18n.t('general:config.name.invalid'),
    label: i18n.t('general:config.name.label'),
    helper: i18n.t('general:config.name.helper'),
  },
  alias: {
    required: i18n.t('general:config.alias.required'),
    max: i18n.t('general:config.alias.max'),
    min: i18n.t('general:config.alias.min'),
    invalid: i18n.t('general:config.alias.invalid'),
    label: i18n.t('general:config.alias.label'),
    helper: i18n.t('general:config.alias.helper'),
  },
  type: {
    label: i18n.t('general:config.type.label'),
    required: i18n.t('general:config.type.required'),
    helper: i18n.t('general:config.type.helper'),
  },
  email: {
    required: i18n.t('general:config.email.required'),
    max: i18n.t('general:config.email.max'),
    invalid: i18n.t('general:config.email.invalid'),
    label: i18n.t('general:config.email.label'),
    helper: i18n.t('general:config.email.helper'),
  },
  phone: {
    required: i18n.t('general:config.phone.required'),
    min: i18n.t('general:config.phone.min'),
    max: i18n.t('general:config.phone.max'),
    invalid: i18n.t('general:config.phone.invalid'),
    label: i18n.t('general:config.phone.label'),
    helper: i18n.t('general:config.phone.helper'),
  },
  year: {
    required: i18n.t('general:config.year.required'),
    max: i18n.t('general:config.year.max'),
    label: i18n.t('general:config.year.label'),
  },
  cui: {
    required: i18n.t('general:config.cui.required'),
    max: i18n.t('general:config.cui.max'),
    min: i18n.t('general:config.cui.min'),
    invalid: i18n.t('general:config.cui.invalid'),
    label: i18n.t('general:config.cui.label'),
  },
  raf: {
    required: i18n.t('general:config.raf.required'),
    max: i18n.t('general:config.raf.max'),
    min: i18n.t('general:config.raf.min'),
    invalid: i18n.t('general:config.raf.invalid'),
    label: i18n.t('general:config.raf.label'),
  },
  city: {
    required: i18n.t('general:config.city.required'),
    label: i18n.t('general:config.city.label'),
  },
  county: {
    required: i18n.t('general:config.county.required'),
    label: i18n.t('general:config.county.label'),
  },
  short: {
    required: i18n.t('general:config.short.required'),
    max: i18n.t('general:config.short.max'),
    min: i18n.t('general:config.short.min'),
    label: i18n.t('general:config.short.label'),
    helper: i18n.t('general:config.short.helper'),
  },
  long: {
    required: i18n.t('general:config.long.required'),
    max: i18n.t('general:config.long.max'),
    min: i18n.t('general:config.long.min'),
    label: i18n.t('general:config.long.label'),
    helper: i18n.t('general:config.long.helper'),
  },
  contact: {
    required: i18n.t('general:config.contact.required'),
    max: i18n.t('general:config.contact.max'),
    min: i18n.t('general:config.contact.min'),
    invalid: i18n.t('general:config.contact.invalid'),
    label: i18n.t('general:config.contact.label'),
  },
  contact_email: {
    required: i18n.t('general:config.contact_email.required'),
    max: i18n.t('general:config.contact_email.max'),
    invalid: i18n.t('general:config.contact_email.invalid'),
    label: i18n.t('general:config.contact_email.label'),
  },
  contact_phone: {
    required: i18n.t('general:config.contact_phone.required'),
    max: i18n.t('general:config.contact_phone.max'),
    min: i18n.t('general:config.contact_phone.min'),
    invalid: i18n.t('general:config.contact_phone.invalid'),
    label: i18n.t('general:config.contact_phone.label'),
  },
  website: {
    required: i18n.t('general:config.website.required'),
    invalid: i18n.t('general:config.website.invalid'),
    label: i18n.t('general:config.website.label'),
  },
  facebook: i18n.t('general:config.facebook'),
  donation: i18n.t('general:config.donation'),
  redirect: i18n.t('general:config.redirect'),
  sms: {
    length: i18n.t('general:config.sms.length'),
    invalid: i18n.t('general:config.sms.invalid'),
    label: i18n.t('general:config.sms.label'),
    helper: i18n.t('general:config.sms.helper'),
  },
  keyword: {
    max: i18n.t('general:config.keyword.max'),
    invalid: i18n.t('general:config.keyword.invalid'),
    label: i18n.t('general:config.keyword.label'),
    helper: i18n.t('general:config.keyword.helper'),
  },
  address: {
    required: i18n.t('general:config.address.required'),
    max: i18n.t('general:config.address.max'),
    label: i18n.t('general:config.address.label'),
    helper: i18n.t('general:config.address.helper'),
    placeholder: i18n.t('general:config.address.placeholder'),
  },
  hasSameAddress: {
    label: i18n.t('general:config.has_same_address.label'),
  },
  organizationAddress: {
    max: i18n.t('general:config.organization_address.max'),
    label: i18n.t('general:config.organization_address.label'),
    helper: i18n.t('general:config.organization_address.helper'),
    placeholder: i18n.t('general:config.organization_address.placeholder'),
  },
  organizationCity: {
    required: i18n.t('general:config.organization_city.required'),
    label: i18n.t('general:config.organization_city.label'),
  },
  organizationCounty: {
    required: i18n.t('general:config.organization_county.required'),
    label: i18n.t('general:config.organization_county.label'),
  },
};

export const OrganizationGeneralConfig: Record<string, any> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: translations.name.required,
      },
      maxLength: {
        value: 100,
        message: translations.name.max,
      },
      minLength: {
        value: 3,
        message: translations.name.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.name.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.name.label,
      helperText: translations.name.helper,
      placeholder: '',
    },
  },
  alias: {
    key: 'alias',
    rules: {
      required: {
        value: true,
        message: translations.alias.required,
      },
      maxLength: {
        value: 100,
        message: translations.alias.max,
      },
      minLength: {
        value: 3,
        message: translations.alias.min,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.alias.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.alias.label,
      helperText: translations.alias.helper,
      placeholder: '',
    },
  },
  type: {
    key: 'type',
    label: translations.type.label,
    rules: {
      required: {
        value: true,
        message: translations.type.required,
      },
    },
    helperText: translations.type.helper,
    radioConfigs: [
      {
        label: OrganizationTypeNaming[OrganizationTypeEnum.ASSOCIATION],
        name: 'type',
        value: OrganizationTypeEnum.ASSOCIATION,
        id: 'org-type__association',
      },
      {
        label: OrganizationTypeNaming[OrganizationTypeEnum.FOUNDATION],
        name: 'type',
        value: OrganizationTypeEnum.FOUNDATION,
        id: 'org-type__foundation',
      },
      {
        label: OrganizationTypeNaming[OrganizationTypeEnum.FEDERATION],
        name: 'type',
        value: OrganizationTypeEnum.FEDERATION,
        id: 'org-type__federation',
      },
    ],
  },
  email: {
    key: 'email',
    rules: {
      required: {
        value: true,
        message: translations.email.required,
      },
      maxLength: {
        value: 50,
        message: translations.email.max,
      },
      pattern: {
        value: EMAIL_REGEX,
        message: translations.email.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.email.label,
      helperText: translations.email.helper,
      placeholder: '',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      required: {
        value: true,
        message: translations.phone.required,
      },
      minLength: {
        value: 10,
        message: translations.phone.min,
      },
      maxLength: {
        value: 15,
        message: translations.phone.max,
      },
      pattern: {
        value: PHONE_REGEX,
        message: translations.phone.invalid,
      },
    },
    config: {
      type: 'tel',
      label: translations.phone.label,
      helperText: translations.phone.helper,
      placeholder: '',
    },
  },
  yearCreated: {
    key: 'yearCreated',
    rules: {
      required: {
        value: true,
        message: translations.year.required,
      },
      maxLength: {
        value: 4,
        message: translations.year.max,
      },
    },
    config: {
      type: 'text',
      label: translations.year.label,
      collection: rangeOfYears(1800).sort((a, b) => b - a),
      displayedAttribute: '',
    },
  },
  cui: {
    key: 'cui',
    rules: {
      required: {
        value: true,
        message: translations.cui.required,
      },
      maxLength: {
        value: 12,
        message: translations.cui.max,
      },
      minLength: {
        value: 2,
        message: translations.cui.min,
      },
      pattern: {
        value: CUI_REGEX,
        message: translations.cui.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.cui.label,
      helperText: '',
      placeholder: '',
    },
  },
  rafNumber: {
    key: 'rafNumber',
    rules: {
      required: {
        value: true,
        message: translations.raf.required,
      },
      maxLength: {
        value: 20,
        message: translations.raf.max,
      },
      minLength: {
        value: 8,
        message: translations.raf.min,
      },
      pattern: {
        value: RAF_NUMBER_REGEX,
        message: translations.raf.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.raf.label,
      helperText: '',
      placeholder: '',
    },
  },
  city: {
    key: 'city',
    rules: {
      required: {
        value: true,
        message: translations.city.required,
      },
    },
    config: {
      type: 'text',
      label: translations.city.label,
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
        message: translations.county.required,
      },
    },
    config: {
      type: 'text',
      label: translations.county.label,
      displayedAttribute: 'year',
    },
  },
  shortDescription: {
    key: 'shortDescription',
    rules: {
      required: {
        value: true,
        message: translations.short.required,
      },
      maxLength: {
        value: 250,
        message: translations.short.max,
      },
      minLength: {
        value: 50,
        message: translations.short.min,
      },
    },
    config: {
      type: 'text',
      label: translations.short.label,
      helperText: translations.short.helper,
      placeholder: '',
    },
  },
  description: {
    key: 'description',
    rules: {
      required: {
        value: true,
        message: translations.long.required,
      },
      maxLength: {
        value: 700,
        message: translations.long.max,
      },
      minLength: {
        value: 200,
        message: translations.long.min,
      },
    },
    config: {
      type: 'text',
      label: translations.long.label,
      helperText: translations.long.helper,
      placeholder: '',
    },
  },
  contact_name: {
    key: 'contact_fullName',
    rules: {
      required: {
        value: true,
        message: translations.contact.required,
      },
      maxLength: {
        value: 100,
        message: translations.contact.max,
      },
      minLength: {
        value: 5,
        message: translations.contact.min,
      },
      pattern: {
        value: NAME_REGEX,
        message: translations.contact.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.contact.label,
      helperText: '',
      placeholder: '',
    },
  },
  contact_email: {
    key: 'contact_email',
    rules: {
      required: {
        value: true,
        message: translations.contact_email.required,
      },
      maxLength: {
        value: 50,
        message: translations.contact_email.max,
      },
      pattern: {
        value: EMAIL_REGEX,
        message: translations.contact_email.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.contact_email.label,
      helperText: '',
      placeholder: '',
    },
  },
  contact_phone: {
    key: 'contact_phone',
    rules: {
      required: {
        value: true,
        message: translations.contact_phone.required,
      },
      maxLength: {
        value: 15,
        message: translations.contact_phone.max,
      },
      minLength: {
        value: 10,
        message: translations.contact_phone.min,
      },
      pattern: {
        value: PHONE_REGEX,
        message: translations.contact_phone.invalid,
      },
    },
    config: {
      type: 'tel',
      label: translations.contact_phone.label,
      helperText: '',
      placeholder: '',
    },
  },
  website: {
    key: 'website',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: translations.website.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.website.label,
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  facebook: {
    key: 'facebook',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: 'Facebook',
      helperText: '',
      placeholder: '',
      addOn: InputFieldHttpAddon,
    },
  },
  instagram: {
    key: 'instagram',
    rules: {
      pattern: {
        value: URL_REGEX,
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: 'Instagram',
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
        message: translations.url,
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
        message: translations.url,
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
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: 'TikTok',
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
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: translations.donation,
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
        message: translations.url,
      },
    },
    config: {
      type: 'text',
      label: translations.redirect,
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
        message: translations.sms.length,
      },
      maxLength: {
        value: 4,
        message: translations.sms.length,
      },
      pattern: {
        value: SMS_REGEX,
        message: translations.sms.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.sms.label,
      helperText: translations.sms.helper,
      placeholder: '',
    },
  },
  donationKeyword: {
    key: 'donationKeyword',
    rules: {
      maxLength: {
        value: 10,
        message: translations.keyword.max,
      },
      pattern: {
        value: NAME_REGEX,
        message: translations.keyword.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.keyword.label,
      helperText: translations.keyword.helper,
      placeholder: '',
    },
  },
  address: {
    key: 'address',
    rules: {
      maxLength: {
        value: 100,
        message: translations.address.max,
      },
      required: {
        value: true,
        message: translations.address.required,
      },
    },
    config: {
      type: 'text',
      label: translations.address.label,
      helperText: translations.address.helper,
      placeholder: translations.address.placeholder,
    },
  },
  hasSameAddress: {
    key: 'hasSameAddress',
    rules: {},
    config: {
      type: 'checkbox',
      label: translations.hasSameAddress.label,
    },
  },
  organizationAddress: {
    key: 'organizationAddress',
    rules: {
      maxLength: {
        value: 100,
        message: translations.organizationAddress.max,
      },
    },
    config: {
      type: 'text',
      label: translations.organizationAddress.label,
      helperText: translations.organizationAddress.helper,
      placeholder: translations.organizationAddress.placeholder,
    },
  },
  organizationCity: {
    key: 'organizationCity',
    rules: {},
    config: {
      type: 'text',
      label: translations.organizationCity.label,
      displayedAttribute: 'year',
    },
  },
  organizationCounty: {
    key: 'organizationCounty',
    rules: {},
    config: {
      type: 'text',
      label: translations.organizationCounty.label,
      displayedAttribute: 'year',
    },
  },
};
