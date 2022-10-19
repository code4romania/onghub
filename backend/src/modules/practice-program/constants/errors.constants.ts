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
    message: 'Error while updateing the practice program',
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
};
