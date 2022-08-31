import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../common/hooks/useToast';
import { Loading } from '../../../components/loading/Loading';
import { useApplicationsQuery } from '../../../services/application/Application.queries';
import {
  Application,
  ApplicationStatus,
} from '../../../services/application/interfaces/Application.interface';
import { useApplications } from '../../../store/selectors';
import ApplicationCard from '../../my-apps/components/ApplicationCard';
import { APPLICATION_STATUS_NAME } from '../constants/ApplicationStatus.constant';
import { ApplicationTypeEnum } from '../constants/ApplicationType.enum';

const ApplicationListAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10000);
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [status] = useState<{ status: ApplicationStatus; label: string } | null>({
    status: ApplicationStatus.ACTIVE,
    label: APPLICATION_STATUS_NAME[ApplicationStatus.ACTIVE],
  });

  const navigate = useNavigate();

  const { isLoading, error } = useApplicationsQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    '', // search term
    status?.status,
  );

  const { applications } = useApplications();

  useEffect(() => {
    if (applications?.meta) {
      setPage(applications.meta.currentPage);
      setRowsPerPage(100000);
      setOrderByColumn(applications.meta.orderByColumn);
      setOrderDirection(applications.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) {
      useErrorToast('Error while loading the applications.');
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {applications.items.map((app: Application) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
};

export default ApplicationListAdmin;
