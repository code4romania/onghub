import i18n from '../../config/i18n';
import { ErrorClass } from '../base-error.class';

const enum CREATE_ORGANIZARION_ERRORS {
  REQ_001 = 'REQ_001',
  REQ_002 = 'REQ_002',
  FILE_002 = 'FILE_002',
  FILE_003 = 'FILE_003',
  FILE_004 = 'FILE_004',
  FILE_005 = 'FILE_005',
  APP_003 = 'APP_003',
  ORG_010 = 'ORG_010',
  ORG_027 = 'ORG_027',
}

export class CreateOrganizationError extends ErrorClass<CREATE_ORGANIZARION_ERRORS> {
  private static instance: CreateOrganizationError;

  private constructor() {
    super({
      [CREATE_ORGANIZARION_ERRORS.REQ_001]: i18n.t('organization:create.errors.REQ_001'),
      [CREATE_ORGANIZARION_ERRORS.REQ_002]: i18n.t('organization:create.errors.REQ_002'),
      [CREATE_ORGANIZARION_ERRORS.FILE_002]: i18n.t('common:upload.image'),
      [CREATE_ORGANIZARION_ERRORS.FILE_003]: i18n.t('common:upload.file'),
      [CREATE_ORGANIZARION_ERRORS.FILE_004]: i18n.t('common:upload.image_size'),
      [CREATE_ORGANIZARION_ERRORS.FILE_005]: i18n.t('common:upload.document_size'),
      [CREATE_ORGANIZARION_ERRORS.APP_003]: i18n.t('common:upload.logo'),
      [CREATE_ORGANIZARION_ERRORS.ORG_010]: i18n.t('common:upload.statute'),
      [CREATE_ORGANIZARION_ERRORS.ORG_027]: i18n.t('legal:errors.ORG_027'),
    });
  }

  public static getInstance(): CreateOrganizationError {
    if (!CreateOrganizationError.instance) {
      CreateOrganizationError.instance = new CreateOrganizationError();
    }

    return CreateOrganizationError.instance;
  }
}
