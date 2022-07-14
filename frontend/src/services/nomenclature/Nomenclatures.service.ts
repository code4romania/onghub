import API from '../API';

export const getCounties = (): Promise<any> => {
  return API.get(`https://onghub-api.wearetribus.com/nomenclatures/counties`).then(
    (res) => res.data,
  );
};

export const getCities = (searchTerm: string, countyId?: number): Promise<any> => {
  return API.get(
    `https://onghub-api.wearetribus.com/nomenclatures/cities?search=${searchTerm}${
      countyId ? `&countyId=${countyId}` : ''
    }`,
  ).then((res) => res.data);
};

// export const searchCities = (search)
