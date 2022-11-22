import { MAX_UPLOAD_SIZE } from './file.constants';

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
  SIZE: {
    message: `Maximum size is ${MAX_UPLOAD_SIZE / 1024 / 1024} MB`,
    errorCode: 'FILE_004',
  },
};
