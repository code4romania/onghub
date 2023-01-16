import { BanIcon, RefreshIcon } from '@heroicons/react/outline';
import { TrashIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../../common/hooks/useToast';
import ConfirmationModal from '../../../../components/confim-removal-modal/ConfirmationModal';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import {
  useRemovOngApplication,
  useRestoreApplicationMutation,
  useRestrictApplicationMutation,
} from '../../../../services/application/Application.queries';
import { ApplicationWithOngStatus } from '../../../../services/application/interfaces/Application.interface';
import { ApplicationTypeEnum } from '../../../apps-store/constants/ApplicationType.enum';
import { OngApplicationStatus } from '../../../requests/interfaces/OngApplication.interface';
import { OrganizationApplicationsTableHeaders } from './table-headers/OrganizationApplicationsTable.headers';

interface OrganizationApplicationsTableProps {
  organizationId: string;
  applications?: ApplicationWithOngStatus[];
  isApplicationsLoading: boolean;
  reloadApplications: () => void;
}

const OrganizationApplicationsTable = ({
  organizationId,
  applications,
  isApplicationsLoading,
  reloadApplications,
}: OrganizationApplicationsTableProps) => {
  const [removalCandidate, setRemovaCandidate] = useState<ApplicationWithOngStatus | null>(null);

  const { t } = useTranslation(['applications', 'common']);

  // actions
  const { mutateAsync: restore, isLoading: isRestoringAppccess } = useRestoreApplicationMutation();

  const { mutateAsync: restrict, isLoading: isRestrictingAccess } =
    useRestrictApplicationMutation();

  const { mutateAsync: remove, isLoading: isRemovingApplication } = useRemovOngApplication();

  const buildApplicationActionColumn = (): TableColumn<ApplicationWithOngStatus> => {
    const restrictedApplicationMenu = [
      {
        name: t('options.restore_access'),
        icon: RefreshIcon,
        onClick: onActivateApplication,
        type: PopoverMenuRowType.INFO,
      },
      {
        name: t('options.remove_application'),
        icon: TrashIcon,
        onClick: onRemoveApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const activeApplicationMenu = [
      {
        name: t('options.restrict_access'),
        icon: BanIcon,
        onClick: onRestrictApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const pendingRemovalApplicationMenu = [
      {
        name: t('options.remove_application'),
        icon: TrashIcon,
        onClick: onRemoveApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: ApplicationWithOngStatus) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.ongStatus === OngApplicationStatus.ACTIVE
              ? activeApplicationMenu
              : row.ongStatus === OngApplicationStatus.PENDING_REMOVAL
              ? pendingRemovalApplicationMenu
              : restrictedApplicationMenu
          }
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onActivateApplication = (row: ApplicationWithOngStatus) => {
    restore(
      { organizationId, applicationId: row.id },
      {
        onSuccess: () => reloadApplications(),
        onError: () => useErrorToast(t('error.restore_application')),
      },
    );
  };

  const onRestrictApplication = (row: ApplicationWithOngStatus) => {
    restrict(
      { organizationId, applicationId: row.id },
      {
        onSuccess: () => reloadApplications(),
        onError: () => useErrorToast(t('error.restrict_application')),
      },
    );
  };

  const onRemoveApplication = (row: ApplicationWithOngStatus) => {
    setRemovaCandidate(row);
  };

  const onConfirmDelete = () => {
    if (removalCandidate)
      remove(
        { applicationId: removalCandidate.id, organizationId },
        {
          onSuccess: () => reloadApplications(),
          onSettled: () => setRemovaCandidate(null),
          onError: () => useErrorToast(t('error.remove_application')),
        },
      );
  };

  return (
    <>
      <div className="w-full bg-white shadow rounded-lg">
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('active_apps')}
          </p>
        </div>
        <DataTableComponent
          columns={[...OrganizationApplicationsTableHeaders, buildApplicationActionColumn()]}
          data={
            applications
              ? applications.filter(
                  (application) => application.type !== ApplicationTypeEnum.INDEPENDENT,
                )
              : []
          }
          loading={
            isApplicationsLoading ||
            isRestoringAppccess ||
            isRestrictingAccess ||
            isRemovingApplication
          }
        />
        {removalCandidate && (
          <ConfirmationModal
            title={t('remove_app_modal.title')}
            description={t('remove_app_modal.description')}
            closeBtnLabel={t('common:back')}
            confirmBtnLabel={t('common:delete')}
            onClose={setRemovaCandidate.bind(null, null)}
            onConfirm={onConfirmDelete}
          />
        )}
      </div>
    </>
  );
};

export default OrganizationApplicationsTable;
