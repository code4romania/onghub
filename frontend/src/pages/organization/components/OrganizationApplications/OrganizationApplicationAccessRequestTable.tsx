import { ShieldCheckIcon, XIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import { OrganizationApplicationRequest } from '../../../../services/application/interfaces/Application.interface';
import { useOrganizationApplicationRequestsQuery } from '../../../../services/organization/Organization.queries';
import { OrganizationApplicationRequestsTableHeaders } from './table-headers/OrganizationApplicationAccessRequestTable.headers';

const OrganizationApplicationRequestsTable = ({ organizationId }: { organizationId: string }) => {
  const { t } = useTranslation(['applications', 'common']);

  const {
    data: organizationApplicationRequests,
    isLoading: isApplicationRequestsLoading,
    error: applicationRequestsError,
  } = useOrganizationApplicationRequestsQuery(organizationId);

  useEffect(() => {
    if (applicationRequestsError) {
      useErrorToast(t('error.get_requests'));
    }
  }, [applicationRequestsError]);

  const buildApplicationRequestActionColumn = (): TableColumn<OrganizationApplicationRequest> => {
    const applicationRequestOptions = [
      {
        name: 'Aproba',
        icon: ShieldCheckIcon,
        onClick: onApprove,
        type: PopoverMenuRowType.SUCCESS,
      },
      {
        name: 'Respinge',
        icon: XIcon,
        onClick: onReject,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: OrganizationApplicationRequest) => (
        <PopoverMenu row={row} menuItems={applicationRequestOptions} />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onApprove = (row: OrganizationApplicationRequest) => {
    console.log('not implemented');
  };

  const onReject = (row: OrganizationApplicationRequest) => {
    console.log('not implemented');
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
        <p className="text-gray-800 font-titilliumBold text-xl">{t('pending_app_requests')}</p>
      </div>
      <div className="pb-5 px-10">
        <DataTableComponent
          columns={[
            ...OrganizationApplicationRequestsTableHeaders,
            buildApplicationRequestActionColumn(),
          ]}
          data={organizationApplicationRequests || []}
          loading={isApplicationRequestsLoading}
        />
      </div>
    </div>
  );
};

export default OrganizationApplicationRequestsTable;
