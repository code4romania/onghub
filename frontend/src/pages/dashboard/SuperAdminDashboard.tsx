import { SunIcon, UserGroupIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { useErrorToast } from '../../common/hooks/useToast';
import { Loading } from '../../components/loading/Loading';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';
import { useAllOrganizationsStatisticsQuery } from '../../services/organization/Organization.queries';
import { useAllOrganizationsStatistics } from '../../store/organization/organization-statistics.selectors';

const SuperAdminDashboard = () => {

  const {isLoading, error} = useAllOrganizationsStatisticsQuery();

  const {allOrganizationsStatistics} = useAllOrganizationsStatistics();
 
  useEffect(() => {
    if (error) {
      useErrorToast('Eroare la preloarea datelor');
    }
  }, [error])

  useEffect(() => {
    console.log(allOrganizationsStatistics);
  }, [allOrganizationsStatistics])

  if (isLoading) {
    return <Loading/>
  }
  

  return <div>
    <div className='flex gap-4 flex-wrap'>
      
    </div>
  </div>;
};

export default SuperAdminDashboard;
