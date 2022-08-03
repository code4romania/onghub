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
  association: 'Asociatie',
  foundation: 'Fundatie',
  federation: 'Federatie',
};
