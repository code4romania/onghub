import API from '../API';

export const getCounties = (): Promise<any> => {
  return API.get(`/nomenclatures/counties`, { headers: { public: true } }).then((res) => res.data);
};

export const getCities = (searchTerm: string, countyId?: number): Promise<any> => {
  let queryParams = '';
  if (searchTerm) {
    queryParams = queryParams.concat(`search=${searchTerm}&`);
  }
  if (countyId) {
    queryParams = queryParams.concat(`countyId=${countyId}`);
  }

  return API.get(`/nomenclatures/cities?${queryParams}`, { headers: { public: true } }).then(
    (res) => res.data,
  );
};

export const getDomains = (): Promise<any> => {
  return API.get(`/nomenclatures/domains`, { headers: { public: true } }).then((res) => res.data);
};

export const getRegions = (): Promise<any> => {
  return API.get(`/nomenclatures/regions`, { headers: { public: true } }).then((res) => res.data);
};

export const getFederations = (): Promise<any> => {
  return API.get(`/nomenclatures/federations`, { headers: { public: true } }).then(
    (res) => res.data,
  );
};

export const getCoalitions = (): Promise<any> => {
  return API.get(`/nomenclatures/coalitions`, { headers: { public: true } }).then(
    (res) => res.data,
  );
};
