import i18n from '../../../common/config/i18n';

const translations = {
  independent: i18n.t('appstore:type.independent'),
  simple: i18n.t('appstore:type.simple'),
  standalone: i18n.t('appstore:type.standalone'),

  filter_independent: i18n.t('app:type.independent'),
  filter_simple: i18n.t('app:type.simple'),
  filter_standalone: i18n.t('app:type.standalone'),
  filter_all: i18n.t('app:type.all'),
};

export enum ApplicationTypeEnum {
  ALL = 'all',
  INDEPENDENT = 'independent',
  SIMPLE = 'simple',
  STANDALONE = 'standalone',
}

export const ApplicationTypeNaming = {
  [ApplicationTypeEnum.ALL]: translations.filter_all,
  [ApplicationTypeEnum.INDEPENDENT]: translations.filter_independent,
  [ApplicationTypeEnum.SIMPLE]: translations.filter_simple,
  [ApplicationTypeEnum.STANDALONE]: translations.filter_standalone,
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
