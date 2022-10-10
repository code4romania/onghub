import { ChartOption } from '../../components/line-chart/chart.config';
import API from '../API';

export const getOrganizationsStatistics = (): Promise<any> => {
  return API.get(`organization/statistics`).then((res) => res.data);
};

export const getOneOrganizationStatistics = (id: number): Promise<any> => {
  return API.get(`organization/${id}/statistics`).then((res) => res.data);
};

export const getOrganizationProfileStatistics = (): Promise<any> => {
  return API.get(`organization-profile/statistics`).then((res) => res.data);
};

export const getRequestStatistics = (filter: ChartOption): Promise<any> => {
  return API.get(`organization/request-statistics?organizationRequestFilter=${filter}`).then(
    (res) => res.data,
  );
};

export const getOrganizationStatistics = (filter: ChartOption): Promise<any> => {
  return API.get(`organization/status-statistics?organizationRequestFilter=${filter}`).then(
    (res) => res.data,
  );
};
