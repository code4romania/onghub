export const OrganizationActivityConfig: Record<string, any> = {
  domains: {
    key: 'domains',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required',
      },
    },
    config: {
      title: 'Domenii de activitate*',
      helperText: 'Minim 1 domeniu de activitate.',
      values: [
        { id: 1, name: 'Educatie' },
        { id: 2, name: 'Mediu' },
        { id: 3, name: 'Social' },
      ],
    },
  },
  area: {
    key: 'area',
    label: 'Organizatia isi desfasoara activitatea pe plan',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'Lorem ipsum. Alege din lista sau adauga valoare.',
    radioConfigs: [
      {
        label: 'National',
        name: 'area',
        value: '1',
      },
      {
        label: 'Regional',
        name: 'area',
        value: '2',
      },
      {
        label: 'Local',
        name: 'area',
        value: '3',
      },
      {
        label: 'International',
        name: 'area',
        value: '4',
      },
    ],
  },
  isPartOfFederation: {
    key: 'isPartOfFederation',
    label: 'Organizatia apartine de una sau mai multe federatii?*',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'De exemplu, lorem ipsum. Help text. Help text',
    radioConfigs: [
      {
        label: 'Da',
        name: 'isPartOfFederation',
        value: 'true',
      },
      {
        label: 'Nu',
        name: 'isPartOfFederation',
        value: 'false',
      },
    ],
  },
  isPartOfInternationalOrganization: {
    key: 'isPartOfInternationalOrganization',
    label: 'Organizatia ta face parte dintr-o organizatie internationala?*',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'De exemplu, lorem ipsum. Help text. Help text',
    radioConfigs: [
      {
        label: 'Da',
        name: 'isPartOfInternationalOrganization',
        value: 'true',
      },
      {
        label: 'Nu',
        name: 'isPartOfInternationalOrganization',
        value: 'false',
      },
    ],
  },

  hasBranches: {
    key: 'hasBranches',
    label: 'Organizatia are filiale sau sucursale?*',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'De exemplu, lorem ipsum. Help text. Help text',
    radioConfigs: [
      {
        label: 'Da',
        name: 'hasBranches',
        value: 'true',
      },
      {
        label: 'Nu',
        name: 'hasBranches',
        value: 'false',
      },
    ],
  },

  isSocialServiceViable: {
    key: 'isSocialServiceViable',
    label: 'Esti ONG acreditat pentru servicii sociale?*',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'De exemplu, lorem ipsum. Help text. Help text',
    radioConfigs: [
      {
        label: 'Da',
        name: 'isSocialServiceViable',
        value: 'true',
      },
      {
        label: 'Nu',
        name: 'isSocialServiceViable',
        value: 'false',
      },
    ],
  },

  offersGrants: {
    key: 'offersGrants',
    label: 'Oferi sau administrezi granturi pentru alte ONG-uri?*',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'De exemplu, lorem ipsum. Help text. Help text',
    radioConfigs: [
      {
        label: 'Da',
        name: 'offersGrants',
        value: 'true',
      },
      {
        label: 'Nu',
        name: 'offersGrants',
        value: 'false',
      },
    ],
  },
  isPublicIntrestOrganization: {
    key: 'isPublicIntrestOrganization',
    label: 'Esti declarat ONG de interes public?*',
    rules: {
      required: {
        value: 'true',
        message: 'Field is required.',
      },
    },
    helperText: 'De exemplu, lorem ipsum. Help text. Help text',
    radioConfigs: [
      {
        label: 'Da',
        name: 'isPublicIntrestOrganization',
        value: 'true',
      },
      {
        label: 'Nu',
        name: 'isPublicIntrestOrganization',
        value: 'false',
      },
    ],
  },
};
