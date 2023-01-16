import API from '../API';

export const getPartnersTemplate = (): string => {
  return process.env.REACT_APP_PARTNERS_LIST_TEMPLATE || '';
};

export const getInvestorsTemplate = (): string => {
  return process.env.REACT_APP_INVESTORS_LIST_TEMPLATE || '';
};

export const getPublicFileUrl = (path: string): Promise<string> => {
  return API.get(`/file?path=${encodeURIComponent(path)}`).then((res) => res.data);
};
