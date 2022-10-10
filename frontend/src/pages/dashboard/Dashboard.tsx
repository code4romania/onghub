import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import ExetendedStatisticsCard from '../../components/extended-statistics-card/ExtendedStatisticsCard';
import { Loading } from '../../components/loading/Loading';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';
import { useOneOrganizationStatisticsQuery } from '../../services/organization/Organization.queries';
import { useOrganizationStatistics } from '../../store/organization/organization-statistics.selectors';
import { useSelectedOrganization } from '../../store/selectors';
import {
  AdminDashboardExtendedStatisticsMapping,
  AdminDashboardSimpleStatisticsMapping,
} from './constants/DashboardStatistics.constants';

const Dashboard = () => {
  const { organization } = useSelectedOrganization();
  const { isLoading, error } = useOneOrganizationStatisticsQuery(organization?.id as number);
  const { oneOrganizationStatistics } = useOrganizationStatistics();

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
      {oneOrganizationStatistics && (
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 flex-col-reverse lg:flex-row">
            <div className="flex flex-col gap-4 flex-wrap lg:w-2/3">
              <ExetendedStatisticsCard
                stat={AdminDashboardExtendedStatisticsMapping.isOrganizationUpdated(
                  oneOrganizationStatistics.isOrganizationUpdated,
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <ExetendedStatisticsCard
                  stat={{
                    ...AdminDashboardExtendedStatisticsMapping.numberOfInstalledApps(
                      oneOrganizationStatistics.numberOfInstalledApps,
                    ),
                  }}
                />
                <ExetendedStatisticsCard
                  stat={{
                    ...AdminDashboardExtendedStatisticsMapping.numberOfUsers(
                      oneOrganizationStatistics.numberOfUsers,
                    ),
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4 w">
              <ExetendedStatisticsCard
                stat={AdminDashboardExtendedStatisticsMapping.activity({
                  organizationCreatedOn: oneOrganizationStatistics.organizationCreatedOn,
                  organizationSyncedOn: oneOrganizationStatistics.organizationSyncedOn,
                })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-gray-800 font-titilliumBold text-3xl">{t('about')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <StatisticsCard
                stat={{
                  ...AdminDashboardSimpleStatisticsMapping.numberOfApps,
                  count: oneOrganizationStatistics.hubStatistics.numberOfApplications,
                }}
              />
              <StatisticsCard
                stat={{
                  ...AdminDashboardSimpleStatisticsMapping.numberOfActiveOrganizations,
                  count: oneOrganizationStatistics.hubStatistics.numberOfActiveOrganizations,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
};

export default Dashboard;
