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
    STATUTE: {
      message: 'Error while deleting the organization statute',
      errorCode: 'ORG_027',
    },
  },
  ALREADY_RESTRICTED: {
    message: 'Organization is already RESTRICTED',
    errorCode: 'ORG_016',
  },
  CREATE_NEW_REPORTING_ENTRIES: {
    ALREADY_EXIST: {
      message: 'The reporting entries for this ONG are already existing',
      errorCode: 'ORG_017',
    },
    ANAF_ERRORED: {
      message: 'The ANAF service responded with error',
      errorCode: 'ORG_018',
    },
    ADD_NEW: {
      message: 'Saving the new entries in DB, failed',
      errorCode: 'ORG_019',
    },
  },
  RESTRICTED: {
    message: 'Organization is restricted',
    errorCode: 'ORG_020',
  },
  COMPLETION_STATUS: {
    message: 'Erorr while updating organization Completion Status',
    errorCode: 'ORG_021',
  },
  GET_ORGANIZATIONS_WITH_ACTIVE_PRACTICE_PROGRAMS: {
    message: 'Error while loading organizations with practice programs',
    errorCode: 'ORG_022',
  },
  GET_ORGANIZATION_WITH_ACTIVE_PRACTICE_PROGRAMS: {
    message: 'Error while retrieving the organization',
    errorCode: 'ORG_023',
  },
  GET_ORGANIZATIONS_WITH_ACTIVE_SERVICES: {
    message: 'Error while loading organizations with services',
    errorCode: 'ORG_024',
  },
  GET_ORGANIZATION_WITH_ACTIVE_SERVICES: {
    message: 'Error while retrieving the organization',
    errorCode: 'ORG_025',
  },
  UPDATE_GENERAL: {
    message: 'Error while updating organization general',
    errorCode: 'ORG_026',
  },
  UPDATE_CUI: {
    message: 'Error while recreating financial information for changed CUI',
    errorCode: 'ORG_028',
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
      message: 'User email or phone already exists.',
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
    ORGANIZATION_ALIAS_EXISTS: {
      message: 'An organization with this alias arleady exists',
      errorCode: 'REQ_010',
    },
    ORGANIZATION_EMAIL_EXISTS: {
      message: 'An organization with this email arleady exists',
      errorCode: 'REQ_011',
    },
    ORGANIZATION_PHONE_EXISTS: {
      message: 'An organization with this phone arleady exists',
      errorCode: 'REQ_012',
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
