import API from '../API';

export const getPartnersTemplate = (): string => {
  return (
    `https://${process.env.REACT_APP_PUBLIC_ASSETS_URL}/file_templates/Lista_parteneri.xlsx` || ''
  );
};

export const getInvestorsTemplate = (): string => {
  return (
    `https://${process.env.REACT_APP_PUBLIC_ASSETS_URL}/file_templates/Lista_finantatori.xlsx` || ''
  );
};

export const getPublicFileUrl = (path: string): Promise<string> => {
  return API.get(`/file?path=${encodeURIComponent(path)}`).then((res) => res.data);
};
