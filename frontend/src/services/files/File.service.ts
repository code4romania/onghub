import API from '../API';

export const getPartnersTemplate = (): Promise<any> => {
  return API.get(`/public/partners`).then((res) => res.data);
};

export const getInvestorsTemplate = (): Promise<any> => {
  return API.get(`/public/investors`).then((res) => res.data);
};
