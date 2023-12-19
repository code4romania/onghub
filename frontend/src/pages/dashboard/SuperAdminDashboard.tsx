import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';
import { useAllOrganizationsStatisticsQuery } from '../../services/statistics/statistics.queries';
import { IAllOrganizationsStatistics } from '../organization/interfaces/OrganizationStatistics.interface';
import OrganizationsLineChart from './components/OrganizationsLIneChart';
import RequestsLineChart from './components/RequestsLineChart';
import { SuperAdminDashboardStatisticsMapping } from './constants/DashboardStatistics.constants';

const SuperAdminDashboard = () => {
  const { data: statistics, isLoading, error } = useAllOrganizationsStatisticsQuery();

  const { t } = useTranslation(['dashboard']);

  useEffect(() => {
    if (error) {
      useErrorToast(t('statistics.error'));
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ContentWrapper title={t('title')}>
      <div className="flex gap-4 flex-wrap">
        {statistics &&
          Object.keys(statistics).map((key, index) => (
            <StatisticsCard
              key={index}
              stat={{
                ...SuperAdminDashboardStatisticsMapping[key],
                count: statistics[key as keyof IAllOrganizationsStatistics],
              }}
            />
          ))}
      </div>
      <div className="grid grid-cols-graphs-mobile md:grid-cols-graphs-tablet 3xl:grid-cols-graphs-desktop gap-4 pt-4">
        <RequestsLineChart />
        <OrganizationsLineChart />
      </div>
    </ContentWrapper>
  );
};

export default SuperAdminDashboard;
