export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const VALID_FILE_TYPES = [
  'application/pdf', //.pdf
  'application/msword', //.doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //.docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //.excel
];
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 6; //6MB
export const FILE_URL_EXPIRATION_TIME = 60 * 60 * 24 * 1; //60sec * 60min * 24h * 1day
