export const REQUEST_ERRORS = {
  CREATE: {
    USER_EXISTS: {
      message: 'User email already exists.',
      errorCode: 'REQ_001',
    },
    REQ_EXISTS: {
      message: 'There is already a pending request with the same data.',
      errorCode: 'REQ_002',
    },
    ORGANIZATION_STATUS: {
      message: 'Organization status must be active.',
      errorCode: 'REQ_004',
    },
    APPLICATION_STATUS: {
      message: 'Application status must be active.',
      errorCode: 'REQ_005',
    },
    APP_EXISTS: {
      message: 'The app is already asssigned to the organization.',
      errorCode: 'REQ_006',
    },
  },
  UPDATE: {
    NOT_PENDING: {
      message: 'Could not update a Request with other status than pending.',
      errorCode: 'REQ_003',
    },
    WRONG_TYPE: {
      message: 'Cannot do this operation, wrong request type',
      errorCode: 'REQ_008',
    },
  },
  GET: {
    NOT_FOUND: {
      message: 'Request not found',
      errorCode: 'REQ_007',
    },
  },
};
