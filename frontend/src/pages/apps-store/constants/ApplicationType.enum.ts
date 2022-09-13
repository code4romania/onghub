export enum ApplicationTypeEnum {
  INDEPENDENT = 'independent',
  SIMPLE = 'simple',
  STANDALONE = 'standalone',
}

export const ApplicationTypeNaming = {
  [ApplicationTypeEnum.INDEPENDENT]: 'Website independent',
  [ApplicationTypeEnum.SIMPLE]: 'Necesita login simplu',
  [ApplicationTypeEnum.STANDALONE]: 'Necesita login cu configurare',
};

export const ApplicationTypeCollection = [
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
