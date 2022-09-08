import { EyeIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { TableColumn, SortOrder } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../common/hooks/useToast';
import DataTableFilters from '../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import Select from '../../../components/Select/Select';
import { useApplicationsQuery } from '../../../services/application/Application.queries';
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
      useErrorToast('Error while loading the applications.');
    }
  }, [error]);

  const buildUserActionColumn = (): TableColumn<Application> => {
    const restrictedApplicationMenu = [
      {
        name: 'Vizualizeaza aplicatie',
        icon: EyeIcon,
        onClick: onView,
      },
      {
        name: 'Activeaza aplicatie',
        icon: ShieldCheckIcon,
        onClick: () => alert('not implemented'),
        type: PopoverMenuRowType.SUCCESS,
      },
    ];

    const activeApplicationMenu = [
      {
        name: 'Vizualizeaza aplicatie',
        icon: EyeIcon,
        onClick: onView,
      },
      {
        name: 'Restrictioneaza aplicatie',
        icon: ShieldCheckIcon,
        onClick: () => alert('not implemented'),
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Application) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.status === ApplicationStatus.ACTIVE
              ? activeApplicationMenu
              : restrictedApplicationMenu
          }
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

  const onView = (data: any) => {
    navigate(`/application/${data.id}`);
  };

  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onStatusChange = (selected: { status: ApplicationStatus; label: string }) => {
    setStatus(selected);
  };

  const onTypeChange = (selected: { type: ApplicationTypeEnum; label: string }) => {
    setType(selected);
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
          <div className="basis-1/4">
            <Select
              config={{
                label: 'Tip aplicatie',
                collection: ApplicationTypeCollection,
                displayedAttribute: 'label',
              }}
              selected={type}
              onChange={onTypeChange}
            />
          </div>
          <div className="basis-1/4">
            <Select
              config={{
                label: 'Status',
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
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">Toate aplicatiile</p>
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...ApplicationtListTableHeaders, buildUserActionColumn()]}
            data={applications.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={applications.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={applications.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationListTable;
