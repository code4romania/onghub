import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../../common/hooks/useToast';
import ContentWrapper from '../../../../components/content-wrapper/ContentWrapper';
import ExetendedStatisticsCard from '../../../../components/extended-statistics-card/ExtendedStatisticsCard';
import { Loading } from '../../../../components/loading/Loading';
import { useOneOrganizationStatisticsQuery } from '../../../../services/statistics/statistics.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { SuperAdminOverviewExtendedStatisticsMapping } from '../../../dashboard/constants/DashboardStatistics.constants';
import UserList from '../../../users/components/UserList/UserList';

const OrganizationOverview = () => {
  const { organization } = useSelectedOrganization();
  const { t } = useTranslation(['dashboard']);

  const { data, isLoading, error } = useOneOrganizationStatisticsQuery(organization?.id as number);

  useEffect(() => {
    if (error) {
      useErrorToast(t('statistics.error'));
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {data && (
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 flex-col-reverse lg:flex-row">
            <div className="flex flex-col gap-4 flex-wrap lg:w-2/3">
              <ExetendedStatisticsCard
                stat={SuperAdminOverviewExtendedStatisticsMapping.isOrganizationUpdated(
                  data.isOrganizationUpdated,
                  `/organizations/${organization?.id}/financial`,
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <ExetendedStatisticsCard
                  stat={{
                    ...SuperAdminOverviewExtendedStatisticsMapping.numberOfInstalledApps(
                      data.numberOfInstalledApps,
                      `/organizations/${organization?.id}/applications`,
                    ),
                  }}
                />
                <ExetendedStatisticsCard
                  stat={{
                    ...SuperAdminOverviewExtendedStatisticsMapping.numberOfUsers(
                      data.numberOfUsers,
                    ),
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <ExetendedStatisticsCard
                stat={SuperAdminOverviewExtendedStatisticsMapping.activity({
                  organizationCreatedOn: data.organizationCreatedOn,
                  organizationSyncedOn: data.organizationSyncedOn,
                })}
              />
            </div>
          </div>
          <ContentWrapper title={t('statistics.user_list')}>
            <UserList organizationId={organization?.id} />
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default OrganizationOverview;
