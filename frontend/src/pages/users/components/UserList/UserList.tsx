import React, { useEffect, useState } from 'react';
import { BanIcon } from '@heroicons/react/outline';
import { PencilIcon, RefreshIcon, TrashIcon } from '@heroicons/react/solid';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { PaginationConfig } from '../../../../common/config/pagination.config';
import { OrderDirection } from '../../../../common/enums/sort-direction.enum';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import DateRangePicker from '../../../../components/date-range-picker/DateRangePicker';
import Select from '../../../../components/Select/Select';
import {
  useRemoveUserMutation,
  useRestoreUserMutation,
  useRestrictUserMutation,
  useUsersQuery,
} from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { UserStatusOptions } from '../../constants/filters.constants';
import { UserStatus } from '../../enums/UserStatus.enum';
import { IUser } from '../../interfaces/User.interface';
import { UserListTableHeaders } from './table-headers/UserListTable.headers';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../../../components/confim-removal-modal/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../../../contexts/AuthContext';
import { UserRole } from '../../enums/UserRole.enum';
import * as XLSX from 'xlsx';

const UserList = (props: { organizationId?: number }) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [status, setStatus] = useState<{ status: UserStatus; label: string } | null>();
  const [range, setRange] = useState<Date[]>([]);
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] = useState<boolean>(false);
  const { role } = useAuthContext();

  const { users } = useUser();

  const { t } = useTranslation(['user', 'common']);

  const { isLoading, error, refetch } = useUsersQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
    range,
    props.organizationId as number,
  );
  const restrictUserAccessMutation = useRestrictUserMutation();
  const restoreUserAccessMutation = useRestoreUserMutation();
  const removeUserMutation = useRemoveUserMutation();

  useEffect(() => {
    if (users?.meta) {
      setPage(users.meta.currentPage);
      setRowsPerPage(users.meta.itemsPerPage);
      setOrderByColumn(users.meta.orderByColumn);
      setOrderDirection(users.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (selectedUser) setIsConfirmRemoveModalOpen(true);
  }, [selectedUser]);

  useEffect(() => {
    if (error) useErrorToast(t('list.load_error'));

    if (restrictUserAccessMutation.error) useErrorToast(t('list.restrict_error'));

    if (restoreUserAccessMutation.error) useErrorToast(t('list.restore_error'));

    if (removeUserMutation.error) useErrorToast(t('list.remove_error'));
  }, [
    error,
    restrictUserAccessMutation.error,
    restoreUserAccessMutation.error,
    removeUserMutation.error,
  ]);

  const buildUserActionColumn = (): TableColumn<IUser> => {
    const activeUserMenuItems = [
      {
        name: t('list.restrict'),
        icon: BanIcon,
        onClick: onRestrictAccess,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    // For now onlt admin can edit an user
    if (role === UserRole.ADMIN) {
      activeUserMenuItems.unshift({
        name: t('edit', { ns: 'common' }),
        icon: PencilIcon,
        onClick: onEdit,
        type: PopoverMenuRowType.INFO,
      });
    }

    const restrictedUserMenuItems = [
      {
        name: t('list.give_access'),
        icon: RefreshIcon,
        onClick: onRestoreAccess,
      },
      {
        name: t('edit', { ns: 'common' }),
        icon: PencilIcon,
        onClick: onEdit,
      },
      {
        name: t('list.permanent'),
        icon: TrashIcon,
        onClick: setSelectedUser,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IUser) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.status === UserStatus.ACTIVE ? activeUserMenuItems : restrictedUserMenuItems
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
   * ROW ACTIONS
   */
  const onRestoreAccess = (row: IUser) => {
    restoreUserAccessMutation.mutate([row.id], {
      onSuccess: () => {
        useSuccessToast(`${t('list.restore_success')} ${row.name}`);
        refetch();
      },
    });
  };

  const onEdit = (row: IUser) => {
    navigate(`/user/${row.id}`);
  };

  const onDelete = () => {
    if (selectedUser) {
      removeUserMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          useSuccessToast(`${t('list.remove_success')} ${selectedUser.name}`);
          refetch();
        },
        onSettled: () => {
          setSelectedUser(null);
        },
      });
    }
    setIsConfirmRemoveModalOpen(false);
  };

  const onRestrictAccess = (row: IUser) => {
    restrictUserAccessMutation.mutate([row.id], {
      onSuccess: () => {
        useSuccessToast(`${t('list.restrict_success')} ${row.name}`);
        refetch();
      },
    });
  };

  /**
   * FILTERS
   */
  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onDateChange = (interval: unknown[]) => {
    if (interval[0] && interval[1]) {
      setRange(interval as Date[]);
    }
  };

  const onStatusChange = (selected: { status: UserStatus; label: string }) => {
    setStatus(selected);
  };

  const onResetFilters = () => {
    console.log('snjfbhf');
    setStatus(null);
    setRange([]);
    setSearchWord(null);
  };

  const onCancelUserRemoval = () => {
    setIsConfirmRemoveModalOpen(false);
    setSelectedUser(null);
  };

  /**
   * ACTIONS
   */
  const onExport = () => {
    const userData = users.items.map((item) => {
      return {
        [t('list_header.name')]: item.name,
        [t('list_header.email')]: item.email,
        [t('list_header.phone')]: item.phone,
        [t('list_header.status')]: item.status,
        [t('list_header.created')]: item.createdOn?.slice(0, 10),
      };
    });
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  };

  return (
    <div>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="sm:basis-1/4 w-full">
            <DateRangePicker
              label={t('list.date')}
              value={range.length > 0 ? range : undefined}
              onChange={onDateChange}
            />
          </div>
          <div className="sm:basis-1/4 w-full">
            <Select
              config={{
                label: t('status', { ns: 'common' }),
                collection: UserStatusOptions,
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
            {t('title')}
          </p>
          <button
            type="button"
            className="edit-button sm:text-sm lg:text-base text-xs"
            onClick={onExport}
          >
            {t('list.download')}
          </button>
        </div>
        <div className="pb-2">
          <DataTableComponent
            columns={[...UserListTableHeaders, buildUserActionColumn()]}
            data={users.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={users.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={users.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
        {isConfirmRemoveModalOpen && (
          <ConfirmationModal
            title={t('list.confirmation')}
            description={t('list.description')}
            closeBtnLabel={t('back', { ns: 'common' })}
            confirmBtnLabel={t('delete', { ns: 'common' })}
            onClose={onCancelUserRemoval}
            onConfirm={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default UserList;
