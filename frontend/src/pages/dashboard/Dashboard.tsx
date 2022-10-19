import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import ExetendedStatisticsCard from '../../components/extended-statistics-card/ExtendedStatisticsCard';
import { Loading } from '../../components/loading/Loading';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';
import { useOrganizationProfileStatistics } from '../../services/statistics/statistics.queries';
import {
  AdminDashboardExtendedStatisticsMapping,
  AdminDashboardSimpleStatisticsMapping,
} from './constants/DashboardStatistics.constants';

const Dashboard = () => {
  const { data: statistics, isLoading, error } = useOrganizationProfileStatistics();

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
      {statistics && (
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 flex-col-reverse lg:flex-row">
            <div className="flex flex-col gap-4 flex-wrap lg:w-2/3">
              <ExetendedStatisticsCard
                stat={AdminDashboardExtendedStatisticsMapping.isOrganizationUpdated(
                  statistics.isOrganizationUpdated,
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <ExetendedStatisticsCard
                  stat={{
                    ...AdminDashboardExtendedStatisticsMapping.numberOfInstalledApps(
                      statistics.numberOfInstalledApps,
                    ),
                  }}
                />
                <ExetendedStatisticsCard
                  stat={{
                    ...AdminDashboardExtendedStatisticsMapping.numberOfUsers(
                      statistics.numberOfUsers,
                    ),
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4 w">
              <ExetendedStatisticsCard
                stat={AdminDashboardExtendedStatisticsMapping.activity({
                  organizationCreatedOn: statistics.organizationCreatedOn,
                  organizationSyncedOn: statistics.organizationSyncedOn,
                })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-gray-800 font-titilliumBold sm:text-2xl lg:text-3xl text-lg">
              {t('about')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <StatisticsCard
                stat={{
                  ...AdminDashboardSimpleStatisticsMapping.numberOfApps,
                  count: statistics.hubStatistics.numberOfApplications,
                }}
              />
              <StatisticsCard
                stat={{
                  ...AdminDashboardSimpleStatisticsMapping.numberOfActiveOrganizations,
                  count: statistics.hubStatistics.numberOfActiveOrganizations,
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
