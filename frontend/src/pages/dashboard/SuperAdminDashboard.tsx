import React, { useEffect } from 'react';
import { useErrorToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';
import { useAllOrganizationsStatisticsQuery } from '../../services/organization/Organization.queries';
import { useOrganizationStatistics } from '../../store/organization/organization-statistics.selectors';
import { IAllOrganizationsStatistics } from '../organization/interfaces/OrganizationStatistics.interface';
import { SuperAdminDashboardStatisticsMapping } from './constants/DashboardStatistics.constants';

const SuperAdminDashboard = () => {
  const { isLoading, error } = useAllOrganizationsStatisticsQuery();
  const { allOrganizationsStatistics } = useOrganizationStatistics();

  useEffect(() => {
    if (error) {
      useErrorToast('Eroare la preloarea datelor');
    }
  }, [error])


  if (isLoading) {
    return <Loading />
  }


  return (
    <ContentWrapper
      title={"Dashboard"}
    >
      <div className='flex gap-4 flex-wrap'>
        {allOrganizationsStatistics && Object.keys(allOrganizationsStatistics).map((key, index) => <StatisticsCard key={index} stat={{ ...SuperAdminDashboardStatisticsMapping[key], count: allOrganizationsStatistics[key as keyof IAllOrganizationsStatistics] }} />)}
      </div>
    </ContentWrapper>)
};

export default SuperAdminDashboard;
