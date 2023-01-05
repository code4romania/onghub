import i18n from '../config/i18n';

export const UNKNOWN_ERROR = (errorCode = 'UNK') =>
  `[${errorCode}] ${i18n.t('common:unknown_error')}`;

// TODO: move into organization page module
export const ORGANIZATION_ERRORS: Record<string, string> = {
  RESTRICT: 'ORG_020',
  REQ_009: i18n.t('organization:create.errors.REQ_009'),
  REQ_010: i18n.t('organization:create.errors.REQ_010'),
  REQ_011: i18n.t('organization:create.errors.REQ_011'),
  REQ_012: i18n.t('organization:create.errors.REQ_012'),
  UPDATE_GENERAL: i18n.t('organization:create.errors.ORG_026'),
};

export const USER_ERRORS = {
  RESTRICT: 'USR_012',
  INVALID_STATUS: 'USR_015',
  NOT_FOUND: 'USR_007',
};

export const FILE_ERRORS: Record<string, string> = {
  FILE_002: i18n.t('common:upload.image'),
  FILE_003: i18n.t('common:upload.file'),
  FILE_004: i18n.t('common:upload.image_size'),
  FILE_005: i18n.t('common:upload.document_size'),
  APP_003: i18n.t('common:upload.logo'),
  ORG_010: i18n.t('common:upload.statute'),
  ORG_027: i18n.t('legal:errors.ORG_027'),
};

export const RESTRICTED_USER_ERRORS: Record<string, string> = {
  ORG_020: i18n.t('organization:no_access'),
  USR_012: i18n.t('account:no_access'),
  USR_015: i18n.t('account:no_access'),
};
