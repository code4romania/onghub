import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';
import { useAllOrganizationsStatisticsQuery } from '../../services/organization/Organization.queries';
import { useOrganizationStatistics } from '../../store/organization/organization-statistics.selectors';
import { IAllOrganizationsStatistics } from '../organization/interfaces/OrganizationStatistics.interface';
import OrganizationsLineChart from './components/OrganizationsLIneChart';
import RequestsLineChart from './components/RequestsLineChart';
import { SuperAdminDashboardStatisticsMapping } from './constants/DashboardStatistics.constants';

const SuperAdminDashboard = () => {
  const { isLoading, error } = useAllOrganizationsStatisticsQuery();
  const { allOrganizationsStatistics } = useOrganizationStatistics();

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
        {allOrganizationsStatistics &&
          Object.keys(allOrganizationsStatistics).map((key, index) => (
            <StatisticsCard
              key={index}
              stat={{
                ...SuperAdminDashboardStatisticsMapping[key],
                count: allOrganizationsStatistics[key as keyof IAllOrganizationsStatistics],
              }}
            />
          ))}
      </div>
      <RequestsLineChart />
      <OrganizationsLineChart />
    </ContentWrapper>
  );
};

export default SuperAdminDashboard;
