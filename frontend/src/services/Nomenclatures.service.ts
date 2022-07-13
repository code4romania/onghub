import API from './API';

export const getCounties = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/counties`).then(
    (res) => res.data,
  );
};

export const getCities = (countyId?: number, searchTerm?: string): Promise<any> => {
  return API.get(
    `https://onghub-api.wearetribus.com/nomenclatures/cities?countyId=${countyId}&search=${searchTerm}`,
  ).then((res) => res.data);
};

// export const searchCities = (search)
