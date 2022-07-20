import API from '../API';

export const getCounties = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/counties`).then(
    (res) => res.data,
  );
};

export const getCities = (searchTerm: string, countyId?: number): Promise<any> => {
  let queryParams = '';
  if (searchTerm) {
    queryParams = queryParams.concat(`search=${searchTerm}&`);
  }
  if (countyId) {
    queryParams = queryParams.concat(`countyId=${countyId}`);
  }

  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/cities?${queryParams}`).then(
    (res) => res.data,
  );
};

export const getDomains = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/domains`).then(
    (res) => res.data,
  );
};

export const getRegions = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/regions`).then(
    (res) => res.data,
  );
};

export const getFederations = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/federations`).then(
    (res) => res.data,
  );
};

export const getCoalitions = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/coalitions`).then(
    (res) => res.data,
  );
};
