import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../common/hooks/useToast';
import { Loading } from '../../../components/loading/Loading';
import { useOngApplicationsQuery } from '../../../services/application/Application.queries';
import { ApplicationWithOngStatus } from '../../../services/application/interfaces/Application.interface';
import { useOngApplications } from '../../../store/selectors';
import ApplicationCard from '../../my-apps/components/ApplicationCard';

interface ApplicationListCardsProps {
  showAllApps?: boolean;
}

const ApplicationListCards = ({ showAllApps }: ApplicationListCardsProps) => {
  const { isLoading, error } = useOngApplicationsQuery(showAllApps);
  const { ongApplications: applications } = useOngApplications();
  const { t } = useTranslation('appstore');

  useEffect(() => {
    if (error) {
      useErrorToast(t('list.load_error'));
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid-list">
      {applications.map((app: ApplicationWithOngStatus) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
};

export default ApplicationListCards;
