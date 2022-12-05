import { EyeIcon, ShieldCheckIcon, XIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { TableColumn, SortOrder } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaginationConfig } from '../../../common/config/pagination.config';
import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import DataTableFilters from '../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import DateRangePicker from '../../../components/date-range-picker/DateRangePicker';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import {
  useApplicationRequestsQuery,
  useApproveApplicationRequestMutation,
  useRejectApplicationRequestMutation,
} from '../../../services/request/Request.queries';
import { useApplicationRequests } from '../../../store/request/ApplicationRequests.selectors';
import { IApplicationRequest } from '../../requests/interfaces/Request.interface';
import {
  APPROVE_APPLICATION_MODAL_CONFIG,
  REJECT_APPLICATION_MODAL_CONFIG,
} from './ApplicationRequestModals';
import { ApplicationRequestsTableHeaders } from './ApplicationRequests.headers';

const ApplicationRequests = () => {
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [range, setRange] = useState<Date[]>([]);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IApplicationRequest | null>(null);

  const { t } = useTranslation('appstore');

  const navigate = useNavigate();

  const { mutateAsync: approveMutate, error: approveError } =
    useApproveApplicationRequestMutation();
  const { mutateAsync: rejectMutate, error: rejectError } = useRejectApplicationRequestMutation();

  const { applicationRequests: requests } = useApplicationRequests();

  const { isLoading, error, refetch } = useApplicationRequestsQuery(
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
      setRowsPerPage(requests.meta.itemsPerPage);
      setOrderByColumn(requests.meta.orderByColumn);
      setOrderDirection(requests.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) {
      useErrorToast(t('requests.load_error'));
    } else if (approveError || rejectError) {
      useErrorToast(t('requests.status_error'));
    }
  }, [error, approveError, rejectError]);

  const buildRequestsActionColumn = (): TableColumn<IApplicationRequest> => {
    const activeRequestsMenuItems = [
      {
        name: t('requests.view'),
        icon: EyeIcon,
        onClick: onView,
      },
      {
        name: t('requests.aprove'),
        icon: ShieldCheckIcon,
        onClick: onOpenApprove,
        type: PopoverMenuRowType.SUCCESS,
      },
      {
        name: t('requests.reject'),
        icon: XIcon,
        onClick: onOpenReject,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IApplicationRequest) => (
        <PopoverMenu row={row} menuItems={activeRequestsMenuItems} />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onOpenApprove = (row: IApplicationRequest) => {
    setSelectedRow(row);
    setApproveModalOpen(true);
  };

  const onOpenReject = (row: IApplicationRequest) => {
    setSelectedRow(row);
    setRejectModalOpen(true);
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

  const onView = (data: IApplicationRequest) => {
    navigate(`/application/${data.application.id}`);
  };

  const onApprove = async (data: IApplicationRequest) => {
    await approveMutate(data.id.toString(), {
      onSuccess: () => {
        useSuccessToast(t('requests.status_update'));
        refetch();
      },
      onSettled: () => {
        setApproveModalOpen(false);
      },
    });
  };

  const onReject = async (data: IApplicationRequest) => {
    await rejectMutate(data.id.toString(), {
      onSuccess: () => {
        useSuccessToast(t('requests.status_update'));
        refetch();
      },
      onSettled: () => {
        setRejectModalOpen(false);
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
          <div className="sm:basis-1/4 w-full">
            <DateRangePicker
              label={t('requests.date_added')}
              onChange={onDateChange}
              value={range.length > 0 ? range : undefined}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('requests.requests')}
          </p>
        </div>
        <div className="pb-2">
          <DataTableComponent
            columns={[...ApplicationRequestsTableHeaders, buildRequestsActionColumn()]}
            data={requests.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={requests.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={requests.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
      {isApproveModalOpen && selectedRow && (
        <ConfirmationModal
          {...APPROVE_APPLICATION_MODAL_CONFIG}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={() => onApprove(selectedRow)}
        />
      )}
      {isRejectModalOpen && selectedRow && (
        <ConfirmationModal
          {...REJECT_APPLICATION_MODAL_CONFIG}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={() => onReject(selectedRow)}
        />
      )}
    </div>
  );
};

export default ApplicationRequests;
