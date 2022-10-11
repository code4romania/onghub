import { ChartOption } from '../../components/line-chart/chart.config';
import API from '../API';

export const getOrganizationsStatistics = (): Promise<any> => {
  return API.get(`statistics`).then((res) => res.data);
};

export const getOneOrganizationStatistics = (id: number): Promise<any> => {
  return API.get(`statistics/organization/${id}`).then((res) => res.data);
};

export const getOrganizationProfileStatistics = (): Promise<any> => {
  return API.get(`statistics/organization`).then((res) => res.data);
};

export const getRequestStatistics = (filter: ChartOption): Promise<any> => {
  return API.get(`statistics/request?statisticsFilter=${filter}`).then((res) => res.data);
};

export const getOrganizationStatistics = (filter: ChartOption): Promise<any> => {
  return API.get(`statistics/status?statisticsFilter=${filter}`).then((res) => res.data);
};
