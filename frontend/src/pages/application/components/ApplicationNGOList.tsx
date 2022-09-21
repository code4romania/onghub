import { ShieldCheckIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../common/hooks/useToast';
import DataTableFilters from '../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import Select from '../../../components/Select/Select';
import { useApplicationOrganizationQuery } from '../../../services/application/Application.queries';
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

  const { t } = useTranslation(['app', 'common']);

  const { isLoading, error } = useApplicationOrganizationQuery(
    id as string,
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
  );

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
              : restrictedApplicationMenu
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

  const onRemoveApplication = () => {
    console.log('not implemented');
  };

  const onActivateApplication = () => {
    console.log('not implemented');
  };

  const onRestrictApplication = () => {
    console.log('not implemented');
  };

  return (
    <>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="basis-1/4">
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
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">{t('list.title')}</p>
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...ApplicationNGOListTableHeaders, buildApplicationActionColumns()]}
            data={applicationOrganizations.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={applicationOrganizations.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={applicationOrganizations.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
    </>
  );
};

export default ApplicationNGOList;
