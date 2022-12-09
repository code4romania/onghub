import { ShieldCheckIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../common/hooks/useToast';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import DataTableFilters from '../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import Select from '../../../components/Select/Select';
import {
  useApplicationOrganizationQuery,
  useRemovOngApplication,
  useRestoreApplicationMutation,
  useRestrictApplicationMutation,
} from '../../../services/application/Application.queries';
import { ApplicationOrganization } from '../../../services/application/interfaces/Application.interface';
import { useSelectedApplication } from '../../../store/selectors';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';
import { OngApplicationStatusOptions } from '../constants/filter.constants';
import { ApplicationNGOListTableHeaders } from './headers/application-ngo-list.headers';

const ApplicationNGOList = () => {
  const { id } = useParams();
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [status, setStatus] = useState<{ status: OngApplicationStatus; label: string } | null>();
  const [removalCandidate, setRemovalCandidate] = useState<ApplicationOrganization | null>(null);

  const { t } = useTranslation(['app', 'applications', 'common']);

  // query
  const {
    isLoading,
    error,
    refetch: reloadApplications,
  } = useApplicationOrganizationQuery(
    id as string,
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
  );

  // actions
  const { mutateAsync: restore, isLoading: isRestoringAppccess } = useRestoreApplicationMutation();

  const { mutateAsync: restrict, isLoading: isRestrictingAccess } =
    useRestrictApplicationMutation();

  const { mutateAsync: remove, isLoading: isRemovingApplication } = useRemovOngApplication();

  const { applicationOrganizations } = useSelectedApplication();

  useEffect(() => {
    if (applicationOrganizations?.meta) {
      setPage(applicationOrganizations.meta.currentPage);
      setRowsPerPage(applicationOrganizations.meta.itemsPerPage);
      setOrderByColumn(applicationOrganizations.meta.orderByColumn);
      setOrderDirection(applicationOrganizations.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast(t('list.load_error'));
  }, [error]);

  const buildApplicationActionColumns = (): TableColumn<ApplicationOrganization> => {
    const restrictedApplicationMenu = [
      {
        name: t('list.activate'),
        icon: ShieldCheckIcon,
        onClick: onActivateApplication,
        type: PopoverMenuRowType.INFO,
      },
      {
        name: t('list.remove'),
        icon: TrashIcon,
        onClick: onRemoveApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const pendingRemovalApplicationMenu = [
      {
        name: t('list.remove'),
        icon: TrashIcon,
        onClick: onRemoveApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const activeApplicationMenu = [
      {
        name: t('list.restrict'),
        icon: ShieldCheckIcon,
        onClick: onRestrictApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: ApplicationOrganization) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.status === OngApplicationStatus.ACTIVE
              ? activeApplicationMenu
              : row.status === OngApplicationStatus.RESTRICTED
              ? restrictedApplicationMenu
              : pendingRemovalApplicationMenu
          }
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  /**
   * PAGINATION
   */
  const onRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
  };

  const onChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const onSort = (column: TableColumn<string>, direction: SortOrder) => {
    setOrderByColumn(column.id as string);
    setOrderDirection(
      direction.toLocaleUpperCase() === OrderDirection.ASC
        ? OrderDirection.ASC
        : OrderDirection.DESC,
    );
  };

  /**
   * FILTERS
   */
  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onStatusChange = (selected: { status: OngApplicationStatus; label: string }) => {
    setStatus(selected);
  };

  const onResetFilters = () => {
    setStatus(null);
    setSearchWord(null);
  };

  const onActivateApplication = (row: ApplicationOrganization) => {
    if (id) {
      restore(
        { organizationId: row.organizationId.toString(), applicationId: +id },
        {
          onSuccess: () => reloadApplications(),
          onError: () => useErrorToast(t('error.restore_application')),
        },
      );
    }
  };

  const onRestrictApplication = (row: ApplicationOrganization) => {
    if (id) {
      restrict(
        { organizationId: row.organizationId.toString(), applicationId: +id },
        {
          onSuccess: () => reloadApplications(),
          onError: () => useErrorToast(t('error.restrict_application')),
        },
      );
    }
  };

  const onRemoveApplication = (row: ApplicationOrganization) => {
    setRemovalCandidate(row);
  };

  const onConfirmDelete = () => {
    if (removalCandidate && id)
      remove(
        {
          organizationId: removalCandidate.organizationId.toString(),
          applicationId: +id,
        },
        {
          onSuccess: () => reloadApplications(),
          onSettled: () => setRemovalCandidate(null),
          onError: () => useErrorToast(t('error.remove_application')),
        },
      );
  };

  return (
    <>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="sm:basis-1/4 w-full">
            <Select
              config={{
                label: t('status', { ns: 'common' }),
                collection: OngApplicationStatusOptions,
                displayedAttribute: 'label',
              }}
              selected={status}
              onChange={onStatusChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('list.title')}
          </p>
        </div>
        <div className="pb-2">
          <DataTableComponent
            columns={[...ApplicationNGOListTableHeaders, buildApplicationActionColumns()]}
            data={applicationOrganizations.items}
            loading={
              isLoading || isRemovingApplication || isRestoringAppccess || isRestrictingAccess
            }
            pagination
            sortServer
            paginationPerPage={applicationOrganizations.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={applicationOrganizations.meta.totalItems}
            paginationDefaultPage={page}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
        {removalCandidate && (
          <ConfirmationModal
            title={t('applications:remove_app_modal.title')}
            description={t('applications:remove_app_modal.description')}
            closeBtnLabel={t('common:back')}
            confirmBtnLabel={t('common:delete')}
            onClose={setRemovalCandidate.bind(null, null)}
            onConfirm={onConfirmDelete}
          />
        )}
      </div>
    </>
  );
};

export default ApplicationNGOList;
