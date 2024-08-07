import { NoSymbolIcon, EyeIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { TableColumn, SortOrder } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../common/hooks/useToast';
import DataTableFilters from '../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import Select from '../../../components/Select/Select';
import {
  useApplicationsQuery,
} from '../../../services/application/Application.queries';
import {
  Application,
  ApplicationStatus,
} from '../../../services/application/interfaces/Application.interface';
import { useApplications } from '../../../store/selectors';
import { ApplicationStatusCollection } from '../constants/ApplicationStatus.constant';
import { ApplicationTypeCollection, ApplicationTypeEnum } from '../constants/ApplicationType.enum';
import { ApplicationtListTableHeaders } from './ApplicationList.headers';

const ApplicationListTable = () => {
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [status, setStatus] = useState<{ status: ApplicationStatus; label: string } | null>();
  const [type, setType] = useState<{ type: ApplicationTypeEnum; label: string } | null>();

  const navigate = useNavigate();

  const { t } = useTranslation(['appstore', 'common']);

  const { isLoading, error } = useApplicationsQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
    type?.type,
  );

  const { applications } = useApplications();

  useEffect(() => {
    if (applications?.meta) {
      setPage(applications.meta.currentPage);
      setRowsPerPage(applications.meta.itemsPerPage);
      setOrderByColumn(applications.meta.orderByColumn);
      setOrderDirection(applications.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) {
      useErrorToast(t('list.load_error'));
    }

  }, [error]);

  const buildUserActionColumn = (): TableColumn<Application> => {

    const activeApplicationMenu = [
      {
        name: t('list.view'),
        icon: EyeIcon,
        onClick: onView,
        type: PopoverMenuRowType.INFO,
      },
    ];

    return {
      name: '',
      cell: (row: Application) => (
        <PopoverMenu
          row={row}
          menuItems={activeApplicationMenu}
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

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

  const onView = (data: { id: number }) => {
    navigate(`/application/${data.id}`);
  };

  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onStatusChange = (selected: { status: ApplicationStatus; label: string }) => {
    setStatus(selected);
  };

  const onTypeChange = (selected: { type: ApplicationTypeEnum; label: string }) => {
    selected.type === ApplicationTypeEnum.ALL ? setType(null) : setType(selected);
  };

  const onResetFilters = () => {
    setStatus(null);
    setType(null);
    setSearchWord(null);
  };

  return (
    <div className="w-full h-full">
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="sm:basis-1/4 w-full">
            <Select
              config={{
                label: t('list.type'),
                collection: ApplicationTypeCollection,
                displayedAttribute: 'label',
              }}
              selected={type}
              onChange={onTypeChange}
            />
          </div>
          <div className="sm:basis-1/4 w-full">
            <Select
              config={{
                label: t('list.status'),
                collection: ApplicationStatusCollection,
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
            {t('all')}
          </p>
        </div>
        <DataTableComponent
          columns={[...ApplicationtListTableHeaders, buildUserActionColumn()]}
          data={applications.items}
          loading={
            isLoading
          }
          pagination
          sortServer
          paginationPerPage={applications.meta.itemsPerPage}
          paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
          paginationTotalRows={applications.meta.totalItems}
          paginationDefaultPage={page}
          onChangeRowsPerPage={onRowsPerPageChange}
          onChangePage={onChangePage}
          onSort={onSort}
          onRowClicked={onView}
        />
      </div>
    </div>
  );
};

export default ApplicationListTable;
