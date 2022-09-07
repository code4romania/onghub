import React, { useEffect } from 'react';
import { useErrorToast } from '../../../common/hooks/useToast';
import { Loading } from '../../../components/loading/Loading';
import {
  useMyOngApplicationsQuery,
  useOngApplicationsQuery,
} from '../../../services/application/Application.queries';
import { ApplicationWithOngStatus } from '../../../services/application/interfaces/Application.interface';
import { useOngApplications } from '../../../store/selectors';
import ApplicationCard from '../../my-apps/components/ApplicationCard';

const ApplicationListCards = ({ ong }: { ong?: boolean }) => {
  const { isLoading, error } = ong ? useMyOngApplicationsQuery() : useOngApplicationsQuery();
  const { ongApplications: applications } = useOngApplications();

  useEffect(() => {
    if (error) {
      useErrorToast('Error while loading the applications.');
    }
  }, [error]);

  useEffect(() => {
    console.log(applications);
  }, [applications]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {applications.map((app: ApplicationWithOngStatus) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
};

export default ApplicationListCards;
