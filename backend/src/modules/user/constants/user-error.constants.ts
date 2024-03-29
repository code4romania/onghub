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
  REMOVE: {
    message: 'Could not remove user',
    errorCode: 'USR_005',
  },
  REMOVE_SUPERADMIN: {
    message: 'SuperAdmin account cannot be deleted',
    errorCode: 'USR_006',
  },
  GET: {
    message: 'User not found',
    errorCode: 'USR_007',
  },
  ALREADY_EXISTS_EMAIL: {
    message: 'User already exists with this email',
    errorCode: 'USR_008',
  },
  UPDATE: {
    message: 'Could not update the user',
    errorCode: 'USR_009',
  },
  ACTIVATE: {
    message: 'Could not activate user',
    errorCode: 'USR_010',
  },
  ACCESS: {
    message: 'Could not grant access to applications',
    errorCode: 'USR_011',
  },
  RESTRICTED: {
    message: 'User is restricted',
    errorCode: 'USR_012',
  },
  ALREADY_EXISTS_PHONE: {
    message: 'User already exists with this phone',
    errorCode: 'USR_013',
  },
  MISSING_ORGANIZATION: {
    message: 'User is not part of an organization',
    errorCode: 'USR_014',
  },
  INVALID_EMAIL_COGNITO_CODE_DELIVERY: {
    message: 'Confirmation code could not be sent. The email is invalid.',
    errorCode: 'USR_015',
  },
};
