import i18n from '../../../common/config/i18n';

const translations = {
  association: i18n.t('organization:type.association'),
  foundation: i18n.t('organization:type.foundation'),
  federation: i18n.t('organization:type.federation'),
};

export enum OrganizationTypeEnum {
  ASSOCIATION = 'association',
  FOUNDATION = 'foundation',
  FEDERATION = 'federation',
}

/*
TODO: change this so the key is the org type by using OrganizationTypeEnum
export const OrganizationTypeNaming = {
  OrganizationTypeEnum.ASSOCIATION: 'Asociatie',
  ...
};
*/
export const OrganizationTypeNaming = {
  association: translations.association,
  foundation: translations.foundation,
  federation: translations.federation,
};
