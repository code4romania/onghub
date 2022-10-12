import { useQuery } from 'react-query';
import { ChartOption } from '../../components/line-chart/chart.config';
import {
  getOneOrganizationStatistics,
  getOrganizationProfileStatistics,
  getOrganizationsStatistics,
  getOrganizationStatistics,
  getRequestStatistics,
} from './statistics.service';

export const useAllOrganizationsStatisticsQuery = () => {
  return useQuery(['all-organizations-statistics'], () => getOrganizationsStatistics());
};

export const useOneOrganizationStatisticsQuery = (organizationId: number) => {
  return useQuery(
    ['organizations-statistics', organizationId],
    () => getOneOrganizationStatistics(+organizationId),
    {
      enabled: !!organizationId,
    },
  );
};

export const useOrganizationProfileStatistics = () => {
  return useQuery(['organizations-profile-statistics'], () => getOrganizationProfileStatistics());
};

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
