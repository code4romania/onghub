import { useQuery } from 'react-query';
import { ChartOption } from '../../components/line-chart/chart.config';
import { getOrganizationStatistics, getRequestStatistics } from './statistics.service';

export const useRequestStatistics = (filter: ChartOption) => {
  return useQuery(['request-statistics', filter], () => getRequestStatistics(filter), {
    enabled: !!filter,
  });
};

export const useOrganizationStatistics = (filter: ChartOption) => {
  return useQuery(['organization-statistics', filter], () => getOrganizationStatistics(filter), {
    enabled: !!filter,
  });
};
