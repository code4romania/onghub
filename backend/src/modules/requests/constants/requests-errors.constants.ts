export const REQUEST_ERRORS = {
  CREATE: {
    USER_EXISTS: {
      message: 'User email already exists.',
      errorCode: 'REQ_001',
    },
    REQ_EXISTS: {
      message:
        'There is already a pending request with the same admin email address.',
      errorCode: 'REQ_002',
    },
  },
};
