export const PRACTICE_PROGRAMS_ERRORS = {
  CREATE: {
    message: 'Error while creating the practice program',
    errorCode: 'PP_001',
  },
  MIN_MAX_WORKING_HOURS: {
    message: 'Max working hours cannot be smaller than min working hours',
    errorCode: 'PP_002',
  },
  START_DATE_AFTER_END_DATE: {
    message: 'Practice program start date must be before end date',
    errorCode: 'PP_003',
  },
  NOT_FOUND: {
    message: 'Practice program not found',
    errorCode: 'PP_004',
  },
  UPDATE: {
    message: 'Error while updating the practice program',
    errorCode: 'PP_005',
  },
  NOT_DETERMINED_WITH_END_DATE: {
    message: 'Practice program cannot be undetermined with end date',
    errorCode: 'PP_006',
  },
  DELETE: {
    message: 'Error while deleting practice program',
    errorCode: 'PP_007',
  },
  SEARCH: {
    message: 'Error while searching practice programs',
    errorCode: 'PP_008',
  },
  ENABLE_DISABLE: {
    message: 'Error while updateing status',
    errorCode: 'PP_009',
  },
};

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
};
