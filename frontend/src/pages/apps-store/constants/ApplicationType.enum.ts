import i18n from '../../../common/config/i18n';

const translations = {
  independent: i18n.t('appstore:type.independent'),
  simple: i18n.t('appstore:type.simple'),
  standalone: i18n.t('appstore:type.standalone'),
};

export enum ApplicationTypeEnum {
  ALL = 'all',
  INDEPENDENT = 'independent',
  SIMPLE = 'simple',
  STANDALONE = 'standalone',
}

export const ApplicationTypeNaming = {
  [ApplicationTypeEnum.ALL]: 'Toate',
  [ApplicationTypeEnum.INDEPENDENT]: 'Website independent',
  [ApplicationTypeEnum.SIMPLE]: 'Necesita login simplu',
  [ApplicationTypeEnum.STANDALONE]: 'Necesita login cu configurare',
};

export const ApplicationTypeCollection = [
  {
    type: ApplicationTypeEnum.ALL,
    label: ApplicationTypeNaming[ApplicationTypeEnum.ALL],
  },
  {
    type: ApplicationTypeEnum.INDEPENDENT,
    label: ApplicationTypeNaming[ApplicationTypeEnum.INDEPENDENT],
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
