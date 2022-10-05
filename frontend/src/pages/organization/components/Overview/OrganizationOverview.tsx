import React, { useEffect } from 'react';
import { useErrorToast } from '../../../../common/hooks/useToast';
import ContentWrapper from '../../../../components/content-wrapper/ContentWrapper';
import ExetendedStatisticsCard from '../../../../components/extended-statistics-card/ExtendedStatisticsCard';
import { Loading } from '../../../../components/loading/Loading';
import { useOneOrganizationStatisticsQuery } from '../../../../services/organization/Organization.queries';
import { useOrganizationStatistics } from '../../../../store/organization/organization-statistics.selectors';
import { useSelectedOrganization } from '../../../../store/selectors';
import { AdminDashboardExtendedStatisticsMapping } from '../../../dashboard/constants/DashboardStatistics.constants';
import UserList from '../../../users/components/UserList/UserList';

const OrganizationOverview = () => {
  const { organization } = useSelectedOrganization()
  const { isLoading, error } = useOneOrganizationStatisticsQuery(organization?.id as number);
  const { oneOrganizationStatistics } = useOrganizationStatistics();

  useEffect(() => {
    if (error) {
      useErrorToast('Eroare la preloarea datelor');
    }
  }, [error])

  if (isLoading) {
    return <Loading />
  }

  return (<div>
    {oneOrganizationStatistics && (
      <div className='flex flex-col gap-8'>
        <div className='flex gap-4 flex-col-reverse lg:flex-row'>
          <div className='flex flex-col gap-4 flex-wrap lg:w-2/3'>
            <ExetendedStatisticsCard stat={AdminDashboardExtendedStatisticsMapping.isOrganizationUpdated(oneOrganizationStatistics.isOrganizationUpdated)} />
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <ExetendedStatisticsCard stat={{ ...AdminDashboardExtendedStatisticsMapping.numberOfInstalledApps(oneOrganizationStatistics.numberOfInstalledApps) }} />
              <ExetendedStatisticsCard stat={{ ...AdminDashboardExtendedStatisticsMapping.numberOfUsers(oneOrganizationStatistics.numberOfUsers) }} />
            </div>
          </div>

          <div className='flex gap-4'>
            <ExetendedStatisticsCard stat={AdminDashboardExtendedStatisticsMapping.activity({ organizationCreatedOn: oneOrganizationStatistics.organizationCreatedOn, organizationSyncedOn: oneOrganizationStatistics.organizationSyncedOn })} />
          </div>
        </div>
        <ContentWrapper
          title={"Lista utilizatori"}
        >
          <UserList />
        </ContentWrapper>
      </div>
    )}
  </div>)
};

export default OrganizationOverview;
