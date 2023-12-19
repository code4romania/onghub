import { MAX_UPLOAD_SIZE_FILE, MAX_UPLOAD_SIZE_IMAGE } from './file.constants';

export const FILE_ERRORS = {
  GENERATE_URL: {
    message: 'Error while generating url',
    errorCode: 'FILE_001',
  },
  IMAGE: {
    message: 'Only PNG, JPG, JPEG files allowed',
    errorCode: 'FILE_002',
  },
  FILE: {
    message: 'Only PDF, DOC, DOCX, XLSX files allowed',
    errorCode: 'FILE_003',
  },
  IMAGE_SIZE: {
    message: `Maximum size for images is ${
      MAX_UPLOAD_SIZE_IMAGE / 1024 / 1024
    } MB`,
    errorCode: 'FILE_004',
  },
  DOC_SIZE: {
    message: `Maximum size for documents is ${
      MAX_UPLOAD_SIZE_FILE / 1024 / 1024
    } MB`,
    errorCode: 'FILE_005',
  },
};
