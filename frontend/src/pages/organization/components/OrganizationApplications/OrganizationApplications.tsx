import React from 'react';
import { useParams } from 'react-router-dom';
import OrganizationApplicationAccessRequestTable from './OrganizationApplicationAccessRequestTable';
import OrganizationApplicationsTable from './OrganizationApplicationsTable';

const OrganizationApplications = () => {
  const { id } = useParams();

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <OrganizationApplicationsTable organizationId={id as string} />
      <OrganizationApplicationAccessRequestTable organizationId={id as string} />
    </div>
  );
};

export default OrganizationApplications;
