export const CIVIC_CENTER_SERVICE_ERRORS = {
  CREATE: {
    message: 'Error while creating the service',
    errorCode: 'CCS_001',
  },
  START_DATE_AFTER_END_DATE: {
    message: 'Service start date must be before end date',
    errorCode: 'CCS_002',
  },
  ONLINE_ACCESS: {
    message: 'Online access link and description are required',
    errorCode: 'CCS_003',
  },
  EMAIL_PHONE_ACCESS: {
    message: 'Email, phone and access description are required',
    errorCode: 'CCS_004',
  },
  PHYSICAL_ACCESS: {
    message: 'Address and access description are required',
    errorCode: 'CCS_005',
  },
  UPDATE: {
    message: 'Error while updating the service',
    errorCode: 'CCS_006',
  },
  NOT_FOUND: {
    message: 'Service not found',
    errorCode: 'CCS_007',
  },
  DELETE: {
    message: 'Error while deleting service',
    errorCode: 'CCS_008',
  },
  SERVICE_ACCESS: {
    message: 'At least one service access is required',
    errorCode: 'CCS_009',
  },
  SEARCH: {
    message: 'Error while searching services',
    errorCode: 'CCS_010',
  },
  ENABLE_DISABLE: {
    message: 'Error while updating status',
    errorCode: 'CCS_011',
  },
};

export const FEEDBACK_ERRORS = {
  CREATE: {
    message: 'Error while creating the feedback',
    errorCode: 'FED_001',
  },
  NOT_FOUND: {
    message: 'Feedback not found',
    errorCode: 'FED_002',
  },
  DELETE: {
    message: 'Error while deleting feedback',
    errorCode: 'FED_003',
  },
};
