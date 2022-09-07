export const APPLICATION_ERRORS = {
  CREATE: {
    LOGIN: {
      message: 'Missing Login link',
      errorCode: 'APP_001',
    },
  },
  GET: {
    message: 'Application Not Found',
    errorCode: 'APP_002',
  },
};

export const ONG_APPLICATION_ERRORS = {
  CREATE: {
    message: 'Error while cerateing the app',
    errorCode: 'ONG_APP_001',
  },
  GET: {
    message: 'Application not found',
    errorCode: 'ONG_APP_002',
  },
  DELETE: { message: 'Could not delete application', errorCode: 'ONG_APP_003' },
  UPDATE: { message: 'Could not update application', errorCode: 'ONG_APP_004' },
  RESTRICT: {
    message: 'Could not restrict application',
    errorCode: 'ONG_APP_005',
  },
};

export const APPLICATION_REQUEST_ERRORS = {
  CREATE: {
    APPLICATION_STATUS: {
      message: 'Application status must be active.',
      errorCode: 'APP_REQ_001',
    },
    REQ_EXISTS: {
      message: 'There is already a pending request with the same data.',
      errorCode: 'APP_REQ_002',
    },
    APP_EXISTS: {
      message: 'The app is already asssigned to the organization.',
      errorCode: 'APP_REQ_003',
    },
  },
  GET: {
    NOT_FOUND: {
      message: 'Request not found',
      errorCode: 'APP_REQ_004',
    },
  },
  UPDATE: {
    NOT_PENDING: {
      message: 'Could not update a Request with other status than pending.',
      errorCode: 'APP_REQ_005',
    },
  },
};
