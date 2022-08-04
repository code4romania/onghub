export const ORGANIZATION_ERRORS = {
  GET: {
    message: 'Organization not found',
    errorCode: 'ORG_001',
  },
  CREATE_ACTIVITY: {
    REGION: {
      message: 'Missing region(s)',
      errorCode: 'ORG_002',
    },
    LOCAL: {
      message: 'Missing city/cities',
      errorCode: 'ORG_003',
    },
    FEDERATION: {
      message: 'Missing federations',
      errorCode: 'ORG_004',
    },
    COALITION: {
      message: 'Missing coalitions',
      errorCode: 'ORG_005',
    },
    BRANCH: {
      message: 'Missing branches',
      errorCode: 'ORG_006',
    },
    INTERNATION_ORGANIZATION: {
      message: 'Missing international organization',
      errorCode: 'ORG_007',
    },
  },
  CREATE_LEGAL: {
    DIRECTORS_MIN: {
      message: 'Minimum 3 directors',
      errorCode: 'ORG_008',
    },
  },
  ANAF: {
    message: 'Incoming data not corresponding with data from ANAF',
    errorCode: 'ORG_009',
  },
  UPLOAD: {
    message: 'Error while uploading the files',
    errorCode: 'ORG_010',
  },
  GET_REPORT: {
    message: 'Report not found',
    errorCode: 'ORG_011',
  },
  GET_LEGAL: {
    message: 'Organization Legal not found',
    errorCode: 'ORG_012',
  },
};

export const PARTNER_ERRORS = {
  GET: {
    message: 'Partner not found',
    errorCode: 'PRT_001',
  },
};

export const INVESTOR_ERRORS = {
  GET: {
    message: 'Investor not found',
    errorCode: 'INV_001',
  },
};
