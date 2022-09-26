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
  ACTIVATE: {
    message: 'Organization is already ACTIVE',
    errorCode: 'ORG_013',
  },
  DELETE: {
    NOT_PENDING: {
      message: 'Can only delete pending organizations',
      errorCode: 'ORG_014',
    },
    ONG: {
      message: 'Error while deleting the organization',
      errorCode: 'ORG_015',
    },
  },
  RESTRICT: {
    message: 'Organization is already RESTRICTED',
    errorCode: 'ORG_016',
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

export const ORGANIZATION_REQUEST_ERRORS = {
  CREATE: {
    USER_EXISTS: {
      message: 'User email already exists.',
      errorCode: 'REQ_001',
    },
    REQ_EXISTS: {
      message: 'There is already a pending request with the same data.',
      errorCode: 'REQ_002',
    },
    NAME_EXISTS: {
      message: 'An user with this email address already exists',
      errorCode: 'REQ_006',
    },
    CUI_EXISTS: {
      message: 'An organization with this cui already exists',
      errorCode: 'REQ_007',
    },
    RAF_NUMBER_EXISTS: {
      message: 'An organization with this rafNumber already exists',
      errorCode: 'REQ_008',
    },
    ORGANIZATION_NAME_EXISTS: {
      message: 'An organization with this name already exists',
      errorCode: 'REQ_009',
    },
  },
  UPDATE: {
    NOT_PENDING: {
      message: 'Could not update a Request with other status than pending.',
      errorCode: 'REQ_003',
    },
    REQUEST: {
      message: 'Could not update request.',
      errorCode: 'REQ_005',
    },
  },
  GET: {
    NOT_FOUND: {
      message: 'Request not found',
      errorCode: 'REQ_004',
    },
  },
};
