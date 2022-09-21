import React, { useEffect } from 'react';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import { useOrganizationApplicationRequestsQuery } from '../../../../services/organization/Organization.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { OrganizationApplicationRequestsTableHeaders } from './OrganizationApplicationAccessRequestTable.headers';

const OrganizationApplicationRequestsTable = ({ organizationId }: { organizationId: string }) => {
  const { isLoading: isApplicationRequestsLoading, error: applicationRequestsError } =
    useOrganizationApplicationRequestsQuery(organizationId);

  const { organizationApplicationRequests } = useSelectedOrganization();

  useEffect(() => {
    if (applicationRequestsError) {
      useErrorToast('Eroare la incarcarea requesturilor');
    }
  }, [applicationRequestsError]);

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
        <p className="text-gray-800 font-titilliumBold text-xl">Solicitari de aplicatii</p>
      </div>
      <div className="pb-5 px-10">
        <DataTableComponent
          columns={OrganizationApplicationRequestsTableHeaders}
          data={organizationApplicationRequests}
          loading={isApplicationRequestsLoading}
        />
      </div>
    </div>
  );
};

export default OrganizationApplicationRequestsTable;
