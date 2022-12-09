import { EyeIcon, ShieldCheckIcon, XIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
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
  useApproveOrganizationRequestMutation,
  useRejectOrganizationRequestMutation,
  useRequestsQuery,
} from '../../../services/request/Request.queries';
import { useOrganizationRequests } from '../../../store/selectors';
import { APPROVE_MODAL_CONFIG, REJECT_MODAL_CONFIG } from '../constants/Request.modals';
import { IOrganizationRequest } from '../interfaces/Request.interface';
import { RequestListTableHeaders } from './RequestList.headers';

const RequestList = () => {
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [range, setRange] = useState<Date[]>([]);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IOrganizationRequest | null>(null);

  const { t } = useTranslation('requests');

  const navigate = useNavigate();

  const { mutateAsync: approveMutate, error: approveError } =
    useApproveOrganizationRequestMutation();
  const { mutateAsync: rejectMutate, error: rejectError } = useRejectOrganizationRequestMutation();

  const { organizationRequests: requests } = useOrganizationRequests();

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
      setRowsPerPage(requests.meta.itemsPerPage);
      setOrderByColumn(requests.meta.orderByColumn);
      setOrderDirection(requests.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) {
      useErrorToast(t('load_error'));
    } else if (approveError || rejectError) {
      useErrorToast(t('status_error'));
    }
  }, [error, approveError, rejectError]);

  const buildRequestsActionColumn = (): TableColumn<IOrganizationRequest> => {
    const activeRequestsMenuItems = [
      {
        name: t('view_form'),
        icon: EyeIcon,
        onClick: onView,
      },
      {
        name: t('approve'),
        icon: ShieldCheckIcon,
        onClick: onOpenApprove,
        type: PopoverMenuRowType.SUCCESS,
      },
      {
        name: t('reject'),
        icon: XIcon,
        onClick: onOpenReject,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IOrganizationRequest) => (
        <PopoverMenu row={row} menuItems={activeRequestsMenuItems} />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onOpenApprove = (row: IOrganizationRequest) => {
    setSelectedRow(row);
    setApproveModalOpen(true);
  };

  const onOpenReject = (row: IOrganizationRequest) => {
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

  const onView = (data: IOrganizationRequest) => {
    navigate(`/requests/${data.id}`);
  };

  const onApprove = async (data: IOrganizationRequest) => {
    await approveMutate(data.id.toString(), {
      onSuccess: () => {
        useSuccessToast(t('status_update'));
        refetch(); // TODO: Redirect to /organizations/id
      },
      onSettled: () => {
        setApproveModalOpen(false);
      },
    });
  };

  const onReject = async (data: IOrganizationRequest) => {
    await rejectMutate(data.id.toString(), {
      onSuccess: () => {
        useSuccessToast(t('status_update'));
        useSuccessToast(t('solved'));
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
        <div className="flex gap-x-6 w-full">
          <div className="sm:basis-1/3 lg:basis-1/4 w-full">
            <DateRangePicker
              label={t('created_on')}
              onChange={onDateChange}
              value={range.length > 0 ? range : undefined}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('requests')}
          </p>
        </div>
        <div className="pb-2">
          <DataTableComponent
            columns={[...RequestListTableHeaders, buildRequestsActionColumn()]}
            data={requests.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={requests.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={requests.meta.totalItems}
            paginationDefaultPage={page}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
      {isApproveModalOpen && selectedRow && (
        <ConfirmationModal
          {...APPROVE_MODAL_CONFIG}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={() => onApprove(selectedRow)}
        />
      )}
      {isRejectModalOpen && selectedRow && (
        <ConfirmationModal
          {...REJECT_MODAL_CONFIG}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={() => onReject(selectedRow)}
        />
      )}
    </div>
  );
};

export default RequestList;
