import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../../common/hooks/useToast';
import ConfirmationModal from '../../../../components/confim-removal-modal/ConfirmationModal';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import { OrganizationApplicationRequest } from '../../../../services/application/interfaces/Application.interface';
import { useOrganizationApplicationRequestsQuery } from '../../../../services/organization/Organization.queries';
import {
  useApproveApplicationRequestMutation,
  useRejectApplicationRequestMutation,
} from '../../../../services/request/Request.queries';
import { OrganizationApplicationRequestsTableHeaders } from './table-headers/OrganizationApplicationAccessRequestTable.headers';

interface OrganizationApplicationRequestsTableProps {
  organizationId: string;
  reloadApplications: () => void;
}

const OrganizationApplicationRequestsTable = ({
  organizationId,
  reloadApplications,
}: OrganizationApplicationRequestsTableProps) => {
  const [rejectionCandidate, setRejectionCandidate] = useState<number | null>(null);
  const { t } = useTranslation(['applications', 'common']);

  // query
  const {
    data: organizationApplicationRequests,
    isLoading: isApplicationRequestsLoading,
    error: applicationRequestsError,
    refetch: reloadRequests,
  } = useOrganizationApplicationRequestsQuery(organizationId);

  // mutation
  const { mutateAsync: approve, isLoading: isApprovingRequest } =
    useApproveApplicationRequestMutation();

  const { mutateAsync: reject, isLoading: isRejectingRequest } =
    useRejectApplicationRequestMutation();

  useEffect(() => {
    if (applicationRequestsError) {
      useErrorToast(t('error.get_requests'));
    }
  }, [applicationRequestsError]);

  const buildApplicationRequestActionColumn = (): TableColumn<OrganizationApplicationRequest> => {
    const applicationRequestOptions = [
      {
        name: t('options.approve_request'),
        icon: ShieldCheckIcon,
        onClick: onApprove,
        type: PopoverMenuRowType.SUCCESS,
      },
      {
        name: t('options.reject_request'),
        icon: XMarkIcon,
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

  const reloadData = () => {
    reloadRequests();
    reloadApplications();
  };

  const onApprove = (row: OrganizationApplicationRequest) => {
    approve(row.id.toString(), {
      onSuccess: reloadData,
      onError: () => useErrorToast(t('error.approve_request')),
    });
  };

  const onReject = (row: OrganizationApplicationRequest) => {
    setRejectionCandidate(row.id);
  };

  const onConfirmReject = () => {
    if (rejectionCandidate !== null) {
      reject(rejectionCandidate.toString(), {
        onSuccess: reloadData,
        onError: () => useErrorToast(t('error.reject_request')),
        onSettled: () => setRejectionCandidate(null),
      });
    }
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
        <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
          {t('pending_app_requests')}
        </p>
      </div>
      <DataTableComponent
        columns={[
          ...OrganizationApplicationRequestsTableHeaders,
          buildApplicationRequestActionColumn(),
        ]}
        data={organizationApplicationRequests || []}
        loading={isApplicationRequestsLoading || isRejectingRequest || isApprovingRequest}
      />
      {rejectionCandidate && (
        <ConfirmationModal
          title={t('reject_request_modal.title')}
          description={t('reject_request_modal.description')}
          closeBtnLabel={t('common:back')}
          confirmBtnLabel={t('common:delete')}
          onClose={setRejectionCandidate.bind(null, null)}
          onConfirm={onConfirmReject}
        />
      )}
    </div>
  );
};

export default OrganizationApplicationRequestsTable;
