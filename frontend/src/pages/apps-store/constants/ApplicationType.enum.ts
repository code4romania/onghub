export enum ApplicationTypeEnum {
  INDEPENDENT = 'independent',
  DATA_PULLING = 'data_pulling',
  SIMPLE = 'simple',
  STANDALONE = 'standalone',
}

export const ApplicationTypeNaming = {
  [ApplicationTypeEnum.INDEPENDENT]: 'Website independent',
  [ApplicationTypeEnum.DATA_PULLING]: 'Colecteaza date din ONGHub',
  [ApplicationTypeEnum.SIMPLE]: 'Necesita login simplu',
  [ApplicationTypeEnum.STANDALONE]: 'Necesita login cu configurare',
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
