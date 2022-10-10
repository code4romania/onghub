import { ChartOption } from '../../components/line-chart/chart.config';
import API from '../API';

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
