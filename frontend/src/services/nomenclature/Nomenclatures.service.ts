import { Domain } from 'domain';
import { City } from '../../common/interfaces/city.interface';
import { Coalition } from '../../common/interfaces/coalitions.interface';
import { County } from '../../common/interfaces/county.interface';
import { Faculty } from '../../common/interfaces/faculty.interface';
import { Federation } from '../../common/interfaces/federations.interface';
import { Region } from '../../common/interfaces/region.interface';
import { Skill } from '../../common/interfaces/skill.interface';
import API from '../API';

export const getCounties = (): Promise<County[]> => {
  return API.get(`/nomenclatures/counties`).then((res) => res.data);
};

export const getCities = (searchTerm: string, countyId?: number): Promise<City[]> => {
  let queryParams = '';
  if (searchTerm) {
    queryParams = queryParams.concat(`search=${searchTerm}&`);
  }
  if (countyId) {
    queryParams = queryParams.concat(`countyId=${countyId}`);
  }

  return API.get(`/nomenclatures/cities?${queryParams}`).then((res) => res.data);
};

export const getDomains = (): Promise<Domain[]> => {
  return API.get(`/nomenclatures/domains`).then((res) => res.data);
};

export const getRegions = (): Promise<Region[]> => {
  return API.get(`/nomenclatures/regions`).then((res) => res.data);
};

export const getFederations = (): Promise<Federation[]> => {
  return API.get(`/nomenclatures/federations`).then((res) => res.data);
};

export const getCoalitions = (): Promise<Coalition[]> => {
  return API.get(`/nomenclatures/coalitions`).then((res) => res.data);
};

export const getSkills = (): Promise<Skill[]> => {
  return API.get(`/nomenclatures/skills`).then((res) => res.data);
};

export const getFaculties = (): Promise<Faculty[]> => {
  return API.get(`/nomenclatures/faculties`).then((res) => res.data);
};
