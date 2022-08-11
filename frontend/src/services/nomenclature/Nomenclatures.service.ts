import API from '../API';

export const getCounties = (): Promise<any> => {
  return API.get(`/nomenclatures/counties`).then((res) => res.data);
};

export const getCities = (searchTerm: string, countyId?: number): Promise<any> => {
  let queryParams = '';
  if (searchTerm) {
    queryParams = queryParams.concat(`search=${searchTerm}&`);
  }
  if (countyId) {
    queryParams = queryParams.concat(`countyId=${countyId}`);
  }

  return API.get(`/nomenclatures/cities?${queryParams}`).then((res) => res.data);
};

export const getDomains = (): Promise<any> => {
  return API.get(`/nomenclatures/domains`).then((res) => res.data);
};

export const getRegions = (): Promise<any> => {
  return API.get(`/nomenclatures/regions`).then((res) => res.data);
};

export const getFederations = (): Promise<any> => {
  return API.get(`/nomenclatures/federations`).then((res) => res.data);
};

export const getCoalitions = (): Promise<any> => {
  return API.get(`/nomenclatures/coalitions`).then((res) => res.data);
};
