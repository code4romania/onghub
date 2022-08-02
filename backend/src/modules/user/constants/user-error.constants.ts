export const USER_ERRORS = {
  CREATE: {
    message: 'Could not create user',
    errorCode: 'USR_001',
  },
  CREATE_WRONG_ORG: {
    message: 'The organization to be linked with the user does not exist',
    errorCode: 'USR_002',
  },
  RESTRICT: {
    message: 'Could not restrict user access',
    errorCode: 'USR_003',
  },
  RESTORE: {
    message: 'Could not restore user access',
    errorCode: 'USR_004',
  },
  USER_EXISTS: {
    message: 'User already exists',
    errorCode: 'USR_005',
  },
  USER_MISSING: {
    message: 'User could not be found',
    errorCode: 'USR_006',
  },
};
