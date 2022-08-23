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
