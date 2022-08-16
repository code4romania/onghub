import { EyeIcon, ShieldCheckIcon, XIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import DataTableFilters from '../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import DateRangePicker from '../../../components/date-range-picker/DateRangePicker';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import {
  useApproveRequestMutation,
  useRejectRequestMutation,
  useRequestsQuery,
} from '../../../services/request/Request.queries';
import { useRequests } from '../../../store/selectors';
import { IRequest } from '../interfaces/Request.interface';
import { RequestListTableHeaders } from './RequestList.headers';

const RequestList = () => {
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [range, setRange] = useState<Date[]>([]);

  const navigate = useNavigate();

  const { mutateAsync: approveMutate, error: approveError } = useApproveRequestMutation();
  const { mutateAsync: rejectMutate, error: rejectError } = useRejectRequestMutation();

  const { requests } = useRequests();

  const { isLoading, error, refetch } = useRequestsQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    range,
  );

  useEffect(() => {
    if (requests?.meta) {
      setPage(requests.meta.currentPage);
      setRowsPerPage(requests.meta.itermsPerPage);
      setOrderByColumn(requests.meta.orderByColumn);
      setOrderDirection(requests.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) {
      useErrorToast('Error while loading the requests.');
    } else if (approveError || rejectError) {
      useErrorToast('Error while changing the status');
    }
  }, [error, approveError, rejectError]);

  const buildUserActionColumn = (): TableColumn<IRequest> => {
    const activeUserMenuItems = [
      {
        name: 'Vizualizeaza formular',
        icon: EyeIcon,
        onClick: onView,
      },
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
      cell: (row: IRequest) => <PopoverMenu row={row} menuItems={activeUserMenuItems} />,
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

  const onView = (data: IRequest) => {
    navigate(`/requests/${data.id}`);
  };

  const onApprove = async (data: IRequest) => {
    await approveMutate(data.id.toString(), {
      onSuccess: () => {
        useSuccessToast('Status actualizat.');
        refetch();
      },
    });
  };

  const onReject = async (data: IRequest) => {
    await rejectMutate(data.id.toString(), {
      onSuccess: () => {
        useSuccessToast('Status actualizat.');
        refetch();
      },
    });
  };

  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onDateChange = (interval: unknown[]) => {
    if (interval[0] && interval[1]) {
      setRange(interval as Date[]);
    }
  };

  const onResetFilters = () => {
    setRange([]);
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
            <DateRangePicker label="Data adaugarii" onChange={onDateChange} />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">Solicitari</p>
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...RequestListTableHeaders, buildUserActionColumn()]}
            data={requests.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={requests.meta.itermsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={requests.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestList;
