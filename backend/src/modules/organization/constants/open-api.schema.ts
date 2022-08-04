export const INVESTOR_UPLOAD_SCHEMA = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        numberOfInvestors: { type: 'integer' },
      },
    },
    files: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const PARTNER_UPLOAD_SCHEMA = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        numberOfPartners: { type: 'integer' },
      },
    },
    files: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const ORGANIZATION_UPLOAD_SCHEMA = {
  type: 'object',
  properties: {
    files: {
      type: 'object',
      properties: {
        logo: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        organizationStatute: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  },
};
