import { ALPHANUMERIC_REGEX } from '../../../../common/helpers/format.helper';
import i18n from '../../../../common/config/i18n';

export enum OrganizationAreaEnum {
  LOCAL = 'Local',
  REGIONAL = 'Regional',
  NATIONAL = 'National',
  INTERNATIONAl = 'International',
}

const translations = {
  field: i18n.t('activity:config.field'),
  domains: i18n.t('activity:config.domains'),
  domains_helper: i18n.t('activity:config.domains_helper'),
  area: i18n.t('activity:config.area'),
  area_helper: i18n.t('activity:config.area_helper'),
  cities: i18n.t('activity:config.cities'),
  cities_helper: i18n.t('activity:config.cities_helper'),
  regions: i18n.t('activity:config.regions'),
  regions_helper: i18n.t('activity:config.regions_helper'),
  federations: {
    part_of: i18n.t('activity:config.federations.part_of'),
    helper: i18n.t('activity:config.federations.helper'),
    yes: i18n.t('activity:config.federations.yes'),
    no: i18n.t('activity:config.federations.no'),
    label: i18n.t('activity:config.federations.label'),
  },
  coalitions: {
    part_of: i18n.t('activity:config.coalitions.part_of'),
    helper: i18n.t('activity:config.coalitions.helper'),
    yes: i18n.t('activity:config.coalitions.yes'),
    no: i18n.t('activity:config.coalitions.no'),
    label: i18n.t('activity:config.coalitions.label'),
  },
  international: {
    part_of: i18n.t('activity:config.international.part_of'),
    part_of_helper: i18n.t('activity:config.international.part_of_helper'),
    yes: i18n.t('activity:config.international.yes'),
    no: i18n.t('activity:config.international.no'),
    maxim: i18n.t('activity:config.international.max'),
    minim: i18n.t('activity:config.international.min'),
    invalid: i18n.t('activity:config.international.invalid'),
    label: i18n.t('activity:config.international.label'),
    helper: i18n.t('activity:config.international.helper'),
  },
  branches: {
    has_any: i18n.t('activity:config.branches.has_any'),
    has_any_helper: i18n.t('activity:config.branches.has_any_helper'),
    yes: i18n.t('activity:config.branches.yes'),
    no: i18n.t('activity:config.branches.no'),
    label: i18n.t('activity:config.branches.label'),
    helper: i18n.t('activity:config.branches.helper'),
  },
  social: {
    label: i18n.t('activity:config.social.label'),
    social_helper: i18n.t('activity:config.social.helper'),
    social_yes: i18n.t('activity:config.social.yes'),
    social_no: i18n.t('activity:config.social.no'),
  },
  grants: {
    label: i18n.t('activity:config.grants.label'),
    grants_helper: i18n.t('activity:config.grants.helper'),
    grants_yes: i18n.t('activity:config.grants.yes'),
    grants_no: i18n.t('activity:config.grants.no'),
  },
  public: {
    label: i18n.t('activity:config.public.label'),
    public_helper: i18n.t('activity:config.public.helper'),
    public_yes: i18n.t('activity:config.public.yes'),
    public_no: i18n.t('activity:config.public.no'),
  },
};

export const OrganizationActivityConfig: Record<string, any> = {
  domains: {
    key: 'domains',
    rules: {
      required: {
        value: true,
        message: translations.field,
      },
    },
    config: {
      title: translations.domains,
      helperText: translations.domains_helper,
    },
  },
  area: {
    key: 'area',
    label: translations.area,
    rules: {
      required: {
        value: 'true',
        message: translations.field,
      },
    },
    helperText: translations.area_helper,
    radioConfigs: [
      ...Object.values(OrganizationAreaEnum).map((item) => ({
        label: item,
        value: item,
        name: 'area',
      })),
    ],
  },
  cities: {
    key: 'cities',
    label: translations.cities,
    rules: {
      required: {
        value: 'true',
        message: translations.field,
      },
    },
    helperText: translations.cities_helper,
  },
  regions: {
    key: 'regions',
    rules: {
      required: {
        value: true,
        message: translations.field,
      },
    },
    config: {
      type: 'text',
      label: translations.regions,
      collection: [],
      helperText: translations.regions_helper,
      displayedAttribute: 'name',
    },
  },
  isPartOfFederation: {
    key: 'isPartOfFederation',
    label: translations.federations.part_of,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.federations.helper,
    radioConfigs: [
      {
        label: translations.federations.yes,
        name: 'isPartOfFederation',
        value: 'true',
      },
      {
        label: translations.federations.no,
        name: 'isPartOfFederation',
        value: 'false',
      },
    ],
  },
  federations: {
    key: 'federations',
    rules: {
      required: {
        value: true,
        message: translations.field,
      },
    },
    config: {
      type: 'text',
      label: translations.federations.label,
      collection: [],
      displayedAttribute: 'abbreviation',
    },
  },
  isPartOfCoalition: {
    key: 'isPartOfCoalition',
    label: translations.coalitions.part_of,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.coalitions.helper,
    radioConfigs: [
      {
        label: translations.coalitions.yes,
        name: 'isPartOfCoalition',
        value: 'true',
      },
      {
        label: translations.coalitions.no,
        name: 'isPartOfCoalition',
        value: 'false',
      },
    ],
  },
  coalitions: {
    key: 'coalitions',
    rules: {
      required: {
        value: true,
        message: translations.field,
      },
    },
    config: {
      type: 'text',
      label: translations.coalitions.label,
      collection: [],
      displayedAttribute: 'abbreviation',
    },
  },
  isPartOfInternationalOrganization: {
    key: 'isPartOfInternationalOrganization',
    label: translations.international.part_of,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.international.part_of_helper,
    radioConfigs: [
      {
        label: translations.international.yes,
        name: 'isPartOfInternationalOrganization',
        value: 'true',
      },
      {
        label: translations.international.no,
        name: 'isPartOfInternationalOrganization',
        value: 'false',
      },
    ],
  },
  internationalOrganizationName: {
    key: 'internationalOrganizationName',
    rules: {
      required: {
        value: true,
        message: translations.field,
      },
      maxLength: {
        value: 100,
        message: translations.international.maxim,
      },
      minLength: {
        value: 3,
        message: translations.international.minim,
      },
      pattern: {
        value: ALPHANUMERIC_REGEX,
        message: translations.international.invalid,
      },
    },
    config: {
      type: 'text',
      label: translations.international.label,
      helperText: translations.international.helper,
      placeholder: '',
    },
  },

  hasBranches: {
    key: 'hasBranches',
    label: translations.branches.has_any,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.branches.has_any_helper,
    radioConfigs: [
      {
        label: translations.branches.yes,
        name: 'hasBranches',
        value: 'true',
      },
      {
        label: translations.branches.no,
        name: 'hasBranches',
        value: 'false',
      },
    ],
  },

  branches: {
    key: 'branches',
    label: translations.branches.label,
    rules: {
      required: {
        value: true,
        message: translations.field,
      },
    },
    helperText: translations.branches.helper,
  },
  isSocialServiceViable: {
    key: 'isSocialServiceViable',
    label: translations.social.label,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.social.social_helper,
    radioConfigs: [
      {
        label: translations.social.social_yes,
        name: 'isSocialServiceViable',
        value: 'true',
      },
      {
        label: translations.social.social_no,
        name: 'isSocialServiceViable',
        value: 'false',
      },
    ],
  },

  offersGrants: {
    key: 'offersGrants',
    label: translations.grants.label,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.grants.grants_helper,
    radioConfigs: [
      {
        label: translations.grants.grants_yes,
        name: 'offersGrants',
        value: 'true',
      },
      {
        label: translations.grants.grants_no,
        name: 'offersGrants',
        value: 'false',
      },
    ],
  },
  isPublicIntrestOrganization: {
    key: 'isPublicIntrestOrganization',
    label: translations.public.label,
    rules: {
      required: {
        message: translations.field,
      },
    },
    helperText: translations.public.public_helper,
    radioConfigs: [
      {
        label: translations.public.public_yes,
        name: 'isPublicIntrestOrganization',
        value: 'true',
      },
      {
        label: translations.public.public_no,
        name: 'isPublicIntrestOrganization',
        value: 'false',
      },
    ],
  },
};
