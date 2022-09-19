import { ReplyIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OrderDirection } from '../../../../common/enums/sort-direction.enum';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import ConfirmationModal from '../../../../components/confim-removal-modal/ConfirmationModal';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import DateRangePicker from '../../../../components/date-range-picker/DateRangePicker';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import { useRemoveUserMutation, useUsersQuery } from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { UserStatus } from '../../enums/UserStatus.enum';
import { IUser } from '../../interfaces/User.interface';
import { UserInvitesTableHeaders } from './table-headers/UserInvitesTable.headers';

const UserInvites = () => {
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

  const { t } = useTranslation('user');

  const { users } = useUser();

  const { isLoading, error, refetch } = useUsersQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
    range,
  );
  const removeUserMutation = useRemoveUserMutation();

  useEffect(() => {
    if (users?.meta) {
      setOrderByColumn(users.meta.orderByColumn);
      setOrderDirection(users.meta.orderDirection);
    }
  });

  useEffect(() => {
    if (selectedUser) setIsConfirmRemoveModalOpen(true);
  }, [selectedUser]);

  useEffect(() => {
    if (error) useErrorToast('Eroare la incarcarea invitatiilor');

    if (removeUserMutation.error) useErrorToast('Eroare la stergerea invitatiei');
  }, [error, removeUserMutation.error]);

  const buildUserActionColumn = (): TableColumn<IUser> => {
    const userMenuItems = [
      {
        name: 'Retrimite',
        icon: ReplyIcon,
        onClick: setSelectedUser,
      },
      {
        name: 'Sterge',
        icon: TrashIcon,
        onClick: setSelectedUser,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IUser) => <PopoverMenu row={row} menuItems={userMenuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  /**
   * PAGINATION
   */
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

  const onResetFilters = () => {
    setStatus(null);
    setRange([]);
    setSearchWord(null);
  };

  const onCancelUserRemoval = () => {
    setIsConfirmRemoveModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="basis-1/4">
            <DateRangePicker
              label="Date"
              defaultValue={range.length > 0 ? range : undefined}
              onChange={onDateChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">{t('title')}</p>
          {/* Uncomment once download will be implemented */}
          {/* <button type="button" className="edit-button">
            Descarca Tabel
          </button> */}
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...UserInvitesTableHeaders, buildUserActionColumn()]}
            data={users.items}
            loading={isLoading}
            sortServer
            onSort={onSort}
          />
        </div>
        {isConfirmRemoveModalOpen && (
          <ConfirmationModal
            title="Confirm"
            description="Description"
            closeBtnLabel="Back"
            confirmBtnLabel="Delete"
            onClose={onCancelUserRemoval}
            onConfirm={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default UserInvites;
