import i18n from '../../../common/config/i18n';

const translations = {
  independent: i18n.t('appstore:type.independent'),
  data: i18n.t('appstore:type.data'),
  simple: i18n.t('appstore:type.simple'),
  standalone: i18n.t('appstore:type.standalone'),
};

export enum ApplicationTypeEnum {
  INDEPENDENT = 'independent',
  DATA_PULLING = 'data_pulling',
  SIMPLE = 'simple',
  STANDALONE = 'standalone',
}

export const ApplicationTypeNaming = {
  [ApplicationTypeEnum.INDEPENDENT]: translations.independent,
  [ApplicationTypeEnum.DATA_PULLING]: translations.data,
  [ApplicationTypeEnum.SIMPLE]: translations.simple,
  [ApplicationTypeEnum.STANDALONE]: translations.standalone,
};

export const ApplicationTypeCollection = [
  {
    type: ApplicationTypeEnum.INDEPENDENT,
    label: ApplicationTypeNaming[ApplicationTypeEnum.INDEPENDENT],
  },
  {
    type: ApplicationTypeEnum.DATA_PULLING,
    label: ApplicationTypeNaming[ApplicationTypeEnum.DATA_PULLING],
  },
  {
    type: ApplicationTypeEnum.SIMPLE,
    label: ApplicationTypeNaming[ApplicationTypeEnum.SIMPLE],
  },
  {
    type: ApplicationTypeEnum.STANDALONE,
    label: ApplicationTypeNaming[ApplicationTypeEnum.STANDALONE],
  },
];
